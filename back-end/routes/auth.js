import express from "express";
import {validateRequest} from "zod-express-middleware";
import {loginSchema, registerSchema, verifyEmailSchema} from "../libs/validate-schema.js";
import {loginUser, registerUser, resetPasswordRequest, verifyEmail} from "../controllers/auth-controller.js";
import {string, z} from "zod";

const router = express.Router();
router.post('/register', validateRequest({body: registerSchema}), registerUser);
router.post('/login', validateRequest({body: loginSchema}), loginUser);
router.post('/verify-email', validateRequest({body: verifyEmailSchema}), verifyEmail);
router.post('/reset-password-request', validateRequest({body: {email: z.string().email()}}), resetPasswordRequest);

export default router;