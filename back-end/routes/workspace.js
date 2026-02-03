import { AutoRouter } from 'itty-router';
import { z } from 'zod';
import { wrap } from '../libs/utils.js';
import { inviteMemberSchema, tokenSchema, workspaceSchema } from '../libs/validate-schema.js';
import {
  acceptGenerateInvite,
  acceptInviteByToken,
  createWorkspace,
  getWorkspaceDetail,
  getWorkspaceProject,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
} from '../controllers/workspace-controller.js';

// Khởi tạo Router với base path là /workspaces
const router = AutoRouter({ base: '/workspaces' });

// 1. Create Workspace
// POST /workspaces
router.post('/', (req, ctx) => 
    wrap(createWorkspace, { body: workspaceSchema }, true)(req, ctx)
);

// 2. Get All Workspaces
// GET /workspaces
router.get('/', (req, ctx) => 
    wrap(getWorkspaces, null, true)(req, ctx)
);

// 3. Accept Invite (Đặt trước các route có :workspaceId để tránh xung đột)
// POST /workspaces/accept-invite-token
router.post(
  '/accept-invite-token',
  (req, ctx) => wrap(
    acceptInviteByToken,
    { body: tokenSchema },
    true
  )(req, ctx)
);

// 4. Get Workspace Detail
// GET /workspaces/:workspaceId
// (Code gốc không có validation params nên để null, nhưng bạn có thể thêm nếu muốn)
router.get('/:workspaceId', (req, ctx) => 
    wrap(getWorkspaceDetail, null, true)(req, ctx)
);

// 5. Get Workspace Projects
// GET /workspaces/:workspaceId/projects
router.get('/:workspaceId/projects', (req, ctx) => 
    wrap(getWorkspaceProject, null, true)(req, ctx)
);

// 6. Get Workspace Stats
// GET /workspaces/:workspaceId/stats
router.get('/:workspaceId/stats', (req, ctx) => 
    wrap(getWorkspaceStats, null, true)(req, ctx)
);

// 7. Invite Member
// POST /workspaces/:workspaceId/invite-member
router.post(
  '/:workspaceId/invite-member',
  (req, ctx) => wrap(
    inviteUserToWorkspace,
    {
      params: z.object({ workspaceId: z.string() }),
      body: inviteMemberSchema,
    },
    true
  )(req, ctx)
);

// 8. Accept Generate Invite
// POST /workspaces/:workspaceId/accept-generate-invite
router.post(
  '/:workspaceId/accept-generate-invite',
  (req, ctx) => wrap(
    acceptGenerateInvite,
    {
      params: z.object({ workspaceId: z.string() }),
    },
    true
  )(req, ctx)
);

export default router;