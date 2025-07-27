import express from "express";

import {z} from "zod";
import {validateRequest} from "zod-express-middleware";
import {taskSchema} from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import {createTask} from "../controllers/task-controller.js";

const router = express.Router();

router.post(
    "/:projectId/create-task",
    authMiddleware,
    validateRequest({
        params: z.object({
            projectId: z.string(),
        }),
        body: taskSchema,
    }),
    createTask
);

export default router;