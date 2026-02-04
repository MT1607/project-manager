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
    let bodyData = {};
    try {
        if (req.body) {
            bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        }
    } catch (e) {
        log("Không parse được body json, bỏ qua check email");
    }
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
        error("Arcjet Error: " + ajError.message);
        return res.json({ message: "Security Check Failed", detail: ajError.message }, 500);
    }

    try {
        await connectToDatabase();
    } catch (dbError) {
        return res.json({ message: "Database Connection Failed" }, 500);
    }

    const { expressRes, responsePromise } = createExpressShim({ res, log, error });
    
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