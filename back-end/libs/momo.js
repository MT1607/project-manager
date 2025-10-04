import * as crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();
const createSignature = (rawData) => {
  // Sử dụng Secret Key (MOMO_SECRET_KEY) để mã hóa chuỗi rawData
  return crypto.createHmac('sha256', process.env.MOMO_SECRET_KEY).update(rawData).digest('hex');
};

const rawHashCreatePayment = (orderId, extraData) => {
  return `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${1}&extraData=${Buffer.from(extraData).toString('base64')}&ipnUrl=${process.env.IPN_URL}&orderId=${orderId}&orderInfo=Mua License Pro 30 ngay&partnerCode=${process.env.MOMO_PARTNER_CODE}&redirectUrl=${process.env.REDIRECT_URL}&requestId=${orderId}&requestType=captureWallet`;
};

const rawHashHandleIPN = (
  extraData,
  message,
  orderId,
  orderInfo,
  orderType,
  partnerCode,
  payType,
  requestId,
  responseTime,
  resultCode,
  transId
) => {
  return `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${1}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
};

export { createSignature, rawHashCreatePayment, rawHashHandleIPN };
