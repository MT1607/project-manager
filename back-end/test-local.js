// test-local.js
import dotenv from 'dotenv';
import mainFunction from './index.js'; // Trỏ đúng vào file index.js của bạn

dotenv.config();

/**
 * Hàm giả lập Context của Appwrite
 * Giúp tạo ra req, res, log, error giả để function chạy được dưới local
 */
const createMockContext = (method, path, body = {}, headers = {}) => {
    return {
        req: {
            method: method.toUpperCase(),
            path: path,
            headers: {
                'content-type': 'application/json',
                ...headers
            },
            // Appwrite dùng hàm async json() để lấy body, ta phải giả lập y hệt
            json: async () => body,
            text: async () => JSON.stringify(body),
            query: {}, // Nếu cần test query params (?id=1) thì điền vào đây
        },
        res: {
            json: (data, statusCode = 200) => {
                console.log(`\n🟢 [RESPONSE ${statusCode}] JSON:`);
                console.log(JSON.stringify(data, null, 2));
                return { statusCode, body: data };
            },
            send: (text, statusCode = 200) => {
                console.log(`\n🟢 [RESPONSE ${statusCode}] TEXT:`, text);
                return { statusCode, body: text };
            }
        },
        log: (msg) => console.log("ℹ️ [APPWRITE LOG]:", msg),
        error: (msg) => console.error("🔴 [APPWRITE ERROR]:", msg),
    };
};

// --- CẤU HÌNH TEST CASE Ở ĐÂY ---

// Ví dụ 1: Test Health Check (hoặc trang chủ)
const testCase1 = {
    method: 'GET',
    path: '/api-v1', // Hoặc '/api-v1' nếu bạn chưa xử lý cắt path
    body: {}
};

// Ví dụ 2: Test API Đăng nhập (Auth) - Cần khớp với route trong code của bạn
const testCase2 = {
    method: 'POST',
    path: '/auth/login', // Đảm bảo khớp với routes/auth.js
    body: {
        email: "test@example.com",
        password: "password123"
    }
};

// Ví dụ 3: Test tạo Project (Cần Fake Token nếu có middleware check auth)
const testCase3 = {
    method: 'POST',
    path: '/projects/workspace_123/create-project',
    body: {
        name: "Dự án Test Local",
        description: "Chạy thử từ máy tính"
    },
    headers: {
        // Giả lập token gửi lên header để qua mặt Auth Middleware
        'authorization': 'Bearer fake-jwt-token' 
    }
};

// --- CHẠY TEST ---
(async () => {
    console.log("🚀 Đang khởi động Test Local...");
    
    // --> CHỌN TEST CASE MUỐN CHẠY Ở ĐÂY (Thay testCase2 bằng biến khác)
    const currentTest = testCase1; 

    console.log(`👉 Request: ${currentTest.method} ${currentTest.path}`);
    
    const context = createMockContext(
        currentTest.method, 
        currentTest.path, 
        currentTest.body,
        currentTest.headers
    );

    try {
        // Gọi hàm main từ src/index.js
        await mainFunction(context);
    } catch (err) {
        console.error("💥 Lỗi Crash:", err);
    }
    
    console.log("\n✅ Test hoàn tất (Nhấn Ctrl + C để thoát nếu DB chưa đóng)");
    // process.exit(0); // Có thể mở dòng này nếu muốn tự thoát
})();