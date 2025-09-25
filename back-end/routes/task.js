import express from 'express';

import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { taskSchema } from '../libs/validate-schema.js';
import authMiddleware from '../middleware/auth-middleware.js';
import {
  createTask,
  getTaskById,
  updateTaskDescription,
  updateTaskStatus,
  updateTaskTitle,
  updateTaskAssignees,
  updateTaskPriority,
  addSubtask,
  updateSubTask,
  getActivitiesByResourceId,
  addComment,
  addWatcherTask,
  achievedTask,
  getMyTasks,
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
    body: z.object({ title: z.string() }),
  }),
  updateTaskTitle
);

router.put(
  '/:taskId/description',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ description: z.string() }),
  }),
  updateTaskDescription
);

router.put(
  '/:taskId/status',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ status: z.string() }),
  }),
  updateTaskStatus
);

router.put(
  '/:taskId/assignees',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ assignees: z.array(z.string()) }),
  }),
  updateTaskAssignees
);

router.put(
  '/:taskId/priority',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ priority: z.string() }),
  }),
  updateTaskPriority
);

router.post(
  '/:taskId/add-subtask',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ title: z.string().min(1) }),
  }),
  addSubtask
);

router.put(
  '/:taskId/update-subtask/:subTaskId',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string(), subTaskId: z.string() }),
    body: z.object({ completed: z.boolean() }),
  }),
  updateSubTask
);

router.get('/my-tasks', authMiddleware, getMyTasks);

router.get(
  '/:taskId',
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
  }),
  getTaskById
);

router.get(
  '/:resourceId/activity',
  authMiddleware,
  validateRequest({
    params: z.object({
      resourceId: z.string(),
    }),
  }),
  getActivitiesByResourceId
);

router.post(
  '/:taskId/comments',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ text: z.string().min(1) }),
  }),
  addComment
);

router.post(
  '/:taskId/watcher',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
  }),
  addWatcherTask
);

router.post(
  '/:taskId/achieved',
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
  }),
  achievedTask
);

export default router;
