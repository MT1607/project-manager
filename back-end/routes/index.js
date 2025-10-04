import express from 'express';
import authRoutes from './auth.js';
import workspaceRoutes from './workspace.js';
import projectRoutes from './project.js';
import taskRoutes from './task.js';
import userRoutes from './user.js';
import momoRoutes from './momo-payment.js';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/payment/momo', momoRoutes);

export default router;
