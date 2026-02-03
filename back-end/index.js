// src/index.js
import { Client } from 'node-appwrite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mainRouter from './routes/index.js'; 
import { createExpressShim } from './libs/utils.js';
import aj from './libs/arcjet.js'; // <--- Import Arcjet từ file riêng

dotenv.config();

// Cấu hình Mongoose
let isConnected = false;
async function connectToDatabase() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
        isConnected = true;
        console.log("✅ Đã kết nối Mongoose thành công");
    } catch (error) {
        console.error("❌ Lỗi kết nối Mongoose:", error);
        throw error;
    }
}

export default async ({ req, res, log, error }) => {
    // 1. Chuẩn bị dữ liệu cho Arcjet
    // Appwrite có thể gửi body dạng string hoặc object, cần parse an toàn
    let bodyData = {};
    try {
        if (req.body) {
            bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        }
    } catch (e) {
        log("Không parse được body json, bỏ qua check email");
    }

    // 2. Gọi Arcjet Protect
    // Bắt buộc phải truyền 'requested' (cho TokenBucket) và 'email' (cho ValidateEmail)
    try {
        const decision = await aj.protect(req, {
            requested: 1, // Mỗi request tốn 1 token
            email: bodyData?.email // Truyền email nếu có trong body
        });

        if (decision.isDenied()) {
            error("Arcjet denied: " + decision.reason);
            return res.json({ 
                message: "Forbidden by Security Rules", 
                reason: decision.reason,
                // Trả về chi tiết lỗi email nếu có
                email_error: decision.reason.isEmail() ? decision.reason.emailTypes : null
            }, 403);
        }
    } catch (ajError) {
        // Xử lý trường hợp Arcjet cấu hình sai hoặc thiếu props
        error("Arcjet Error: " + ajError.message);
        // Tùy chọn: Có thể return lỗi hoặc cho qua (fail-open)
        return res.json({ message: "Security Check Failed", detail: ajError.message }, 500);
    }

    // 3. Kết nối Database
    try {
        await connectToDatabase();
    } catch (dbError) {
        return res.json({ message: "Database Connection Failed" }, 500);
    }

    // 4. Xử lý Routing (Express Shim)
    const { expressRes, responsePromise } = createExpressShim({ res, log, error });
    
    // Gán lại body đã parse vào req để Router/Controller dùng luôn, đỡ parse lại
    req.body = bodyData;

    const context = {
        appwriteRes: expressRes,
        responsePromise,
        log,
        error
    };

    try {
        const routerResult = await mainRouter.fetch(req, context);
        
        if (routerResult && routerResult.body) {
            return res.json(routerResult.body, routerResult.status || 200);
        }
        return await responsePromise;
    } catch (err) {
        error("Unhandled Error: " + err.message);
        return res.json({ message: "Internal Server Error" }, 500);
    }
};