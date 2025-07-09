import mongoose from "mongoose";
import {z} from "zod";

const registerSchema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Email is required"),
    password: z.string().min(6, "Password is required"),
});

const loginSchema = z.object({
    email: z.string().email("Email is required"),
    password: z.string().min(1, "Password is required"),
});

const verifyEmailSchema = z.object({
    token: z.string().min(1, "Token is required"),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "New password is required"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
});

const resetPasswordRequestSchema = z.object({
    email: z.string().email("Email is required"),
});

const workspaceSchema = z.object({
    name: z.string().min(1, "Name workspace is required"),
    description: z.string().optional(),
    color: z.string().min(1, "Color is required")
})
export {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    resetPasswordSchema,
    resetPasswordRequestSchema,
    workspaceSchema
};
