import { AutoRouter } from 'itty-router';
import { z } from 'zod'; // Cần import z để định nghĩa schema inline cho params
import { wrap } from '../libs/utils.js'; 
import { projectSchema } from '../libs/validate-schema.js';
import {
  createProject,
  getProjectDetails,
  getProjectTasks,
} from '../controllers/project-controller.js';

// Khởi tạo Router với base path là /projects
const router = AutoRouter({ base: '/projects' });

// 1. Create Project
// POST /projects/:workspaceId/create-project
router.post(
  '/:workspaceId/create-project',
  (req, ctx) => wrap(
    createProject, 
    {
      // Schema validate
      params: z.object({ workspaceId: z.string() }),
      body: projectSchema,
    }, 
    true // true = Yêu cầu đăng nhập (thay thế authMiddleware)
  )(req, ctx)
);

// 2. Get Project Details
// GET /projects/:projectId
router.get(
  '/:projectId',
  (req, ctx) => wrap(
    getProjectDetails,
    {
      params: z.object({ projectId: z.string() }),
    },
    true
  )(req, ctx)
);

// 3. Get Project Tasks
// GET /projects/:projectId/tasks
router.get(
  '/:projectId/tasks',
  (req, ctx) => wrap(
    getProjectTasks,
    {
      params: z.object({ projectId: z.string() }),
    },
    true
  )(req, ctx)
);

export default router;