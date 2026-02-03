import { AutoRouter } from 'itty-router';
import { z } from 'zod';
import { wrap } from '../libs/utils.js'; // Hàm wrap xử lý logic thay thế express
import { taskSchema } from '../libs/validate-schema.js';
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
  getArchivedTasks,
} from '../controllers/task-controller.js';

// Khởi tạo Router cho nhánh /tasks
const router = AutoRouter({ base: '/tasks' });

// --- CREATE ---

// POST /tasks/:projectId/create-task
router.post(
  '/:projectId/create-task',
  (req, ctx) => wrap(
    createTask,
    {
      params: z.object({ projectId: z.string() }),
      body: taskSchema,
    },
    true // Require Auth
  )(req, ctx)
);

// --- UPDATE TASK FIELDS ---

// PUT /tasks/:taskId/title
router.put(
  '/:taskId/title',
  (req, ctx) => wrap(
    updateTaskTitle,
    {
      params: z.object({ taskId: z.string() }),
      body: z.object({ title: z.string() }),
    },
    true
  )(req, ctx)
);

// PUT /tasks/:taskId/description
router.put(
  '/:taskId/description',
  (req, ctx) => wrap(
    updateTaskDescription,
    {
      params: z.object({ taskId: z.string() }),
      body: z.object({ description: z.string() }),
    },
    true
  )(req, ctx)
);

// PUT /tasks/:taskId/status
router.put(
  '/:taskId/status',
  (req, ctx) => wrap(
    updateTaskStatus,
    {
      params: z.object({ taskId: z.string() }),
      body: z.object({ status: z.string() }),
    },
    true
  )(req, ctx)
);

// PUT /tasks/:taskId/assignees
router.put(
  '/:taskId/assignees',
  (req, ctx) => wrap(
    updateTaskAssignees,
    {
      params: z.object({ taskId: z.string() }),
      body: z.object({ assignees: z.array(z.string()) }),
    },
    true
  )(req, ctx)
);

// PUT /tasks/:taskId/priority
router.put(
  '/:taskId/priority',
  (req, ctx) => wrap(
    updateTaskPriority,
    {
      params: z.object({ taskId: z.string() }),
      body: z.object({ priority: z.string() }),
    },
    true
  )(req, ctx)
);

// --- SUBTASKS ---

// POST /tasks/:taskId/add-subtask
router.post(
  '/:taskId/add-subtask',
  (req, ctx) => wrap(
    addSubtask,
    {
      params: z.object({ taskId: z.string() }),
      body: z.object({ title: z.string().min(1) }),
    },
    true
  )(req, ctx)
);

// PUT /tasks/:taskId/update-subtask/:subTaskId
router.put(
  '/:taskId/update-subtask/:subTaskId',
  (req, ctx) => wrap(
    updateSubTask,
    {
      params: z.object({ taskId: z.string(), subTaskId: z.string() }),
      body: z.object({ completed: z.boolean() }),
    },
    true
  )(req, ctx)
);

// --- QUERIES & OTHERS ---

// GET /tasks/my-tasks
// (Không có validation schema vì chỉ cần lấy user từ token)
router.get('/my-tasks', (req, ctx) => wrap(getMyTasks, null, true)(req, ctx));

// GET /tasks/:taskId
router.get(
  '/:taskId',
  (req, ctx) => wrap(
    getTaskById,
    {
      params: z.object({ taskId: z.string() }),
    },
    true
  )(req, ctx)
);

// GET /tasks/:resourceId/activity
router.get(
  '/:resourceId/activity',
  (req, ctx) => wrap(
    getActivitiesByResourceId,
    {
      params: z.object({ resourceId: z.string() }),
    },
    true
  )(req, ctx)
);

// POST /tasks/:taskId/comments
router.post(
  '/:taskId/comments',
  (req, ctx) => wrap(
    addComment,
    {
      params: z.object({ taskId: z.string() }),
      body: z.object({ text: z.string().min(1) }),
    },
    true
  )(req, ctx)
);

// POST /tasks/:taskId/watcher
router.post(
  '/:taskId/watcher',
  (req, ctx) => wrap(
    addWatcherTask,
    {
      params: z.object({ taskId: z.string() }),
    },
    true
  )(req, ctx)
);

// POST /tasks/:taskId/achieved
router.post(
  '/:taskId/achieved',
  (req, ctx) => wrap(
    achievedTask,
    {
      params: z.object({ taskId: z.string() }),
    },
    true
  )(req, ctx)
);

// GET /tasks/workspace/:workspaceId/archived
router.get(
  '/workspace/:workspaceId/archived',
  (req, ctx) => wrap(
    getArchivedTasks,
    {
      params: z.object({ workspaceId: z.string() }),
    },
    true
  )(req, ctx)
);

export default router;