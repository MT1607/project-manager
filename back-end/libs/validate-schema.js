import mongoose from "mongoose";
import {z} from "zod";


const registerSchema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Email is required"),
    password: z.string().min(6, "Password is required"),
})

const loginSchema = z.object({
    email: z.string().email("Email is required"),
    password: z.string().min(1, "Password is required"),
})

const verifyEmailSchema = z.object({
    token: z.string().min(1, "Token is required"),
})
export {registerSchema, loginSchema, verifyEmailSchema};