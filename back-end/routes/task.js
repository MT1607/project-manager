import express from 'express';

import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { taskSchema } from '../libs/validate-schema.js';
import authMiddleware from '../middleware/auth-middleware.js';
import {
  createTask,
  getTaskById,
  updateTaskDescription,
  updateTaskTitle,
} from '../controllers/task-controller.js';

const router = express.Router();

router.post(
  '/:projectId/create-task',
  authMiddleware,
  validateRequest({
    params: z.object({
      projectId: z.string(),
    }),
    body: taskSchema,
  }),
  createTask
);

router.put(
  '/:taskId/title',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
  }),
  updateTaskTitle
);

router.put(
  '/:taskId/description',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
  }),
  updateTaskDescription
);

router.get(
  '/:taskId',
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
    // body: z.object({ title: z.string() }),
  }),
  getTaskById
);

export default router;
