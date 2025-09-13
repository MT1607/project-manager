import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { workspaceSchema } from '../libs/validate-schema.js';
import authMiddleware from '../middleware/auth-middleware.js';
import {
  createWorkspace,
  getWorkspaceDetail,
  getWorkspaceProject,
  getWorkspaces,
  getWorkspaceStats,
} from '../controllers/workspace-controller.js';

const router = express.Router();
router.post('/', authMiddleware, validateRequest({ body: workspaceSchema }), createWorkspace);

router.get('/', authMiddleware, getWorkspaces);

router.get('/:workspaceId', authMiddleware, getWorkspaceDetail);
router.get('/:workspaceId/projects', authMiddleware, getWorkspaceProject);
router.get('/:workspaceId/stats', authMiddleware, getWorkspaceStats);
export default router;
