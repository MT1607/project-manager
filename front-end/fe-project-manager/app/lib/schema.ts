import {z} from "zod";
import {ProjectStatus} from "~/types";

export const signInSchema = z.object({
    email: z.string().email("Email is required."),
    password: z.string().min(8, "Password is required."),
});

export const signUpSchema = z
    .object({
        email: z.string().email("Email is required."),
        password: z.string().min(8, "Password must be least 8 characters"),
        name: z.string().min(3, "Name must be least 3 characters"),
        confirmPassword: z.string().min(8, "Password must be 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    });

export const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(8, "New password is required"),
        confirmPassword: z.string().min(8, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "New password do not math.",
    });

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email is required."),
});

export const workspaceSchema = z.object({
    name: z.string().min(3, "Name is required."),
    color: z.string().min(3, "Color is required."),
    description: z.string().optional(),
});

export const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(10, "Start Date is required"),
    dueDate: z.string().min(10, "Start Date is required"),
    members: z
        .array(
            z.object({
                user: z.string(),
                role: z.enum(["manager", "contributor", "viewer"]),
            })
        ),
    tags: z.string().optional(),
});

export const createTaskSchema = z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().min(1, "Due date is required"),
    assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});

