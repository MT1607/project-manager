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

const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().optional(),
    status: z.nativeEnum([
        "Planning",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
    ]),
    startDate: z.string(),
    dueDate: z.string(),
    members: z
        .array(
            z.object({
                user: z.string(),
                role: z.enum(["admin", "contributor", "viewer"]),
            })
        ).optional(),
    tags: z.string().optional(),
});

const taskSchema = z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().min(1, "Due date is required"),
    assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});


export {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    resetPasswordSchema,
    resetPasswordRequestSchema,
    workspaceSchema,
    projectSchema,
    taskSchema
};
