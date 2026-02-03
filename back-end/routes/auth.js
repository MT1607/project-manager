import { AutoRouter } from 'itty-router';
import { wrap } from '../libs/utils.js'; // Hàm wrap chúng ta đã tạo ở bước trước
import {
    loginSchema,
    registerSchema,
    resetPasswordRequestSchema,
    resetPasswordSchema,
    verifyEmailSchema
} from "../libs/validate-schema.js";
import {
    loginUser,
    registerUser,
    resetPasswordRequest,
    verifyEmail,
    verifyResetPasswordAndResetPassword
} from "../controllers/auth-controller.js";

// Khởi tạo Router. 
// Quan trọng: 'base' phải khớp với đường dẫn bạn khai báo trong router tổng (index.js)
const router = AutoRouter({ base: '/auth' });

// Cú pháp wrap: wrap(Controller, { body: ZodSchema }, RequireAuth?)

// 1. Register
router.post('/register', (req, ctx) => 
    wrap(registerUser, { body: registerSchema }, false)(req, ctx)
);

// 2. Login
router.post('/login', (req, ctx) => 
    wrap(loginUser, { body: loginSchema }, false)(req, ctx)
);

// 3. Verify Email
router.post('/verify-email', (req, ctx) => 
    wrap(verifyEmail, { body: verifyEmailSchema }, false)(req, ctx)
);

// 4. Reset Password Request
router.post('/reset-password-request', (req, ctx) => 
    wrap(resetPasswordRequest, { body: resetPasswordRequestSchema }, false)(req, ctx)
);

// 5. Reset Password Confirm
router.post('/reset-password', (req, ctx) => 
    wrap(verifyResetPasswordAndResetPassword, { body: resetPasswordSchema }, false)(req, ctx)
);

export default router;