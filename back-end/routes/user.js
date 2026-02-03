import { AutoRouter } from 'itty-router';
import { z } from 'zod';
import { wrap } from '../libs/utils.js';
import {
  changePassword,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user-controller.js';

// Khởi tạo Router với base path khớp với file index.js gốc (router.use('/users', ...))
const router = AutoRouter({ base: '/users' });

// 1. Get User Profile
// GET /users/profile
router.get(
  '/profile',
  (req, ctx) => wrap(
    getUserProfile, 
    null, // Không cần validate body/params
    true  // Require Auth = true
  )(req, ctx)
);

// 2. Update User Profile
// PUT /users/profile
router.put(
  '/profile',
  (req, ctx) => wrap(
    updateUserProfile,
    {
      body: z.object({
        name: z.string(),
        profilePicture: z.string().optional(),
      }),
    },
    true
  )(req, ctx)
);

// 3. Change Password
// PUT /users/change-password
router.put(
  '/change-password',
  (req, ctx) => wrap(
    changePassword,
    {
      body: z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
        confirmPassword: z.string(),
      }),
    },
    true
  )(req, ctx)
);

export default router;