import {z} from "zod";

export const signInSchema = z.object({
    email: z.string().email("Email is required."),
    password: z.string().min(8, "Password is required.")
})

export const signUpSchema = z.object({
    email: z.string().email("Email is required."),
    password: z.string().min(8, "Password must be least 8 characters"),
    name: z.string().min(3, "Name must be least 3 characters"),
    confirmPassword: z.string().min(8, "Password must be 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "New password is required"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "New password do not math."
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email is required."),
});

export const workspaceSchema = z.object({
    name: z.string().min(3, "Name is required."),
    color: z.string().min(3, "Color is required."),
    description: z.string().optional()
})