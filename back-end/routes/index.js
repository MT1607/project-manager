import { AutoRouter } from 'itty-router';

// Import các router con đã chuyển đổi
import authRouter from './auth.js';
import workspaceRouter from './workspace.js';
import projectRouter from './project.js';
import taskRouter from './task.js';
import userRouter from './user.js';
// import momoRouter from './momo-payment.js'; // Tạm thời comment nếu chưa convert file này

// Khởi tạo Router tổng
const router = AutoRouter();

// --- CẤU HÌNH NESTED ROUTING ---
// Cú pháp: router.all('/duong-dan-goc/*', routerCon.fetch)
// Lưu ý: Dấu /* ở cuối là bắt buộc để itty-router hiểu là "giao toàn bộ nhánh con này cho router khác"

// 1. Auth Routes (/auth/login, /auth/register...)
router.all('/auth/*', authRouter.fetch);

// 2. Workspace Routes (/workspaces/create, /workspaces/:id...)
router.all('/workspaces/*', workspaceRouter.fetch);

// 3. Project Routes (/projects/:id...)
router.all('/projects/*', projectRouter.fetch);

// 4. Task Routes (/tasks/create...)
router.all('/tasks/*', taskRouter.fetch);

// 5. User Routes (/users/profile...)
router.all('/users/*', userRouter.fetch);

// 6. Payment Routes
// Nếu bạn chưa sửa file momo-payment.js, hãy tạm comment dòng dưới để tránh lỗi build
// router.all('/payment/momo/*', momoRouter.fetch);

// --- XỬ LÝ 404 NOT FOUND ---
// Nếu request chạy qua tất cả các dòng trên mà không khớp, trả về lỗi 404
router.all('*', () => ({
    status: 404,
    body: { message: "Route not found or method not allowed" }
}));

export default router;