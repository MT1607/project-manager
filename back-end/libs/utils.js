// libs/utils.js
import { z } from 'zod';

// 1. Hàm giả lập Response của Express để dùng lại Controller cũ
export const createExpressShim = (appwriteContext) => {
    const { res, log, error } = appwriteContext;
    
    // Tạo một promise để đợi Controller xử lý xong
    let resolveResponse;
    const responsePromise = new Promise((resolve) => {
        resolveResponse = resolve;
    });

    const expressRes = {
        status: (code) => expressRes, // Chaining .status().json()
        json: (data) => {
            resolveResponse(res.json(data)); // Trả về cho Appwrite
        },
        send: (text) => {
            resolveResponse(res.send(text));
        }
    };

    return { expressRes, responsePromise };
};

// 2. Middleware Wrapper: Xử lý Auth và Zod trước khi vào Controller
export const wrap = (handler, schema = null, requireAuth = false, dbClient = null) => {
    return async (req, context) => { // context ở đây là custom data ta truyền vào
        const { appwriteRes, responsePromise, user } = context;

        // --- CHECK AUTH ---
        if (requireAuth) {
            // Logic check auth của bạn (JWT verify...)
            // Nếu bạn dùng Appwrite Auth, check req.headers['x-appwrite-user-id']
            // Nếu bạn dùng JWT riêng, verify token ở đây
            // Giả sử logic check auth nằm ở index.js và truyền user vào đây
            if (!user) {
                return appwriteRes.status(401).json({ message: "Unauthorized" });
            }
            req.user = user; // Gán user vào req để Controller dùng
        }

        // --- CHECK ZOD (Validate Request) ---
        if (schema) {
            try {
                // Combine body, query, params để validate
                const dataToValidate = {
                    body: await req.json().catch(() => ({})), // Appwrite req.body cần parse
                    params: req.params,
                    query: req.query
                };
                
                // Parse Zod
                if (schema.body) schema.body.parse(dataToValidate.body);
                if (schema.params) schema.params.parse(dataToValidate.params);
                
                req.body = dataToValidate.body; // Gán lại body đã parse
            } catch (err) {
                 return appwriteRes.status(400).json({ error: err.errors });
            }
        }

        // --- GỌI CONTROLLER CŨ ---
        try {
            await handler(req, appwriteRes);
            return await responsePromise; // Đợi Controller trả về kết quả
        } catch (err) {
            console.error(err);
            return appwriteRes.status(500).json({ error: "Internal Error" });
        }
    };
};