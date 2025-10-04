import { createSignature, rawHashCreatePayment, rawHashHandleIPN } from '../libs/momo.js';
import PaymentLog from '../models/payment.js';
import dotenv from 'dotenv';
import axios from 'axios';
import License from '../models/license.js';

dotenv.config();

const createPayment = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).send({ message: 'User not found' });
  }

  const orderId = `PRO_${new Date().getTime()}`;
  const requestId = orderId;
  const extraData = JSON.stringify({ userId });

  try {
    const rawHash = rawHashCreatePayment(orderId, extraData);
    const signature = createSignature(rawHash);

    const requestBody = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      partnerName: 'Test',
      storeId: 'MoMoTestStore',
      requestId: requestId,
      amount: 1,
      orderId: orderId,
      orderInfo: `Mua License Pro 30 ngày`,
      redirectUrl: process.env.REDIRECT_URL,
      ipnUrl: process.env.IPN_URL,
      lang: 'VI',
      requestType: 'captureWallet',
      extraData: Buffer.from(extraData).toString('base64'),
      signature: signature,
      orderType: '',
    };

    await PaymentLog.create({
      userId: userId,
      orderId: orderId,
      amount: 1,
      status: 'PENDING',
      paymentDay: new Date(),
    });

    const result = await axios.post(process.env.MOMO_CREATE_PAYMENT_URL, requestBody);

    if (result.data && result.data.payUrl) {
      return res.status(200).send({
        data: result.data.payUrl,
        message: 'Redirect to MoMo payment gateway',
      });
    } else {
      console.error('MoMo API Error:', result.data);
      return res.status(500).send({ message: 'Error generating payment URL from MoMo.' });
    }
  } catch (e) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const handleIPN = async (req, res) => {
  const data = req.body;
  const { orderId, resultCode, transId, responseTime, signature: momoSignature, extraData } = data;

  // 1. XÁC THỰC CHỮ KÝ (giống logic phần trước)
  const rawHash = rawHashHandleIPN(
    extraData,
    data.message,
    orderId,
    data.orderInfo,
    data.orderType,
    data.partnerCode,
    data.payloadType,
    data.requestId,
    responseTime,
    resultCode,
    transId
  );
  const calculatedSignature = createSignature(rawHash);

  if (calculatedSignature !== momoSignature) {
    console.error(`[IPN] Lỗi xác thực chữ ký cho Order ID: ${orderId}`);
    return res.status(204).end();
  }

  try {
    // 2. LẤY USER ID VÀ TÌM LOG GIAO DỊCH
    const decodedExtraData = JSON.parse(Buffer.from(extraData, 'base64').toString('ascii'));
    const userId = decodedExtraData.userId;
    const paymentLog = await PaymentLog.findOne({ orderId: orderId });

    if (!paymentLog) {
      console.warn(`[IPN] Not found payment log: ${orderId}`);
      return res.status(204).end();
    }

    // 3. XỬ LÝ KHI THANH TOÁN THÀNH CÔNG (resultCode = 0)
    if (resultCode === 0 && paymentLog.status === 'PENDING') {
      // a. CẬP NHẬT TRẠNG THÁI LOG THANH TOÁN
      paymentLog.status = 'SUCCESS';
      await paymentLog.save();

      // b. CẬP NHẬT LICENSE PRO CHO USER
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // Ngày hết hạn: +30 ngày

      await License.findByIdAndUpdate(userId, {
        type: 'pro',
        expiredDate: expiryDate,
      });

      console.log(
        `[IPN SUCCESS] Cấp License Pro thành công cho User ID: ${userId}, Order ID: ${orderId}`
      );
    }

    // 4. XỬ LÝ KHI THANH TOÁN THẤT BẠI (resultCode != 0)
    else if (resultCode !== 0) {
      paymentLog.status = 'FAILURE';
      await paymentLog.save();
      console.log(`[IPN FAILURE] Order ID: ${orderId}. Mã lỗi: ${resultCode}.`);
    }

    // 5. PHẢN HỒI CHO MO MO
    res.status(204).end(); // Trả về 204 No Content để xác nhận đã nhận IPN
  } catch (error) {
    console.error(`[IPN] Lỗi xử lý DB hoặc logic cho Order ID: ${orderId}`, error);
    // Có thể cần gửi log lỗi ra bên ngoài
    res.status(204).end();
  }
};

export { createPayment, handleIPN };
