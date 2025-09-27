import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/auth/auth-layout.tsx', [
    index('routes/root/home.tsx'),
    route('sign-in', 'routes/auth/sign-in.tsx'),
    route('sign-up', 'routes/auth/sign-up.tsx'),
    route('forgot-password', 'routes/auth/forgot-password.tsx'),
    route('reset-password', 'routes/auth/reset-password.tsx'),
    route('verify-email', 'routes/auth/verify-email.tsx'),
  ]),

  layout('routes/dashboard/dashboard-layout.tsx', [
    route('dashboard', 'routes/dashboard/index.tsx'),
    route('workspaces', 'routes/dashboard/workspace/index.tsx'),
    route('workspaces/:workspaceId', 'routes/dashboard/workspace/workspace-detail.tsx'),
    route(
      'workspaces/:workspaceId/projects/:projectId',
      'routes/dashboard/project/project-details.tsx'
    ),
    route(
      'workspaces/:workspaceId/projects/:projectId/tasks/:taskId',
      'routes/dashboard/task/task-detail.tsx'
    ),
    route('my-tasks', 'routes/dashboard/my-tasks.tsx'),
    route('members', 'routes/dashboard/members.tsx'),
    route('archived', 'routes/dashboard/archived-tasks.tsx'),
    route('license', 'routes/dashboard/license/index.tsx'),
  ]),

  route('workspace-invite/:workspaceId', 'routes/dashboard/workspace/workspace-invite.tsx'),
  layout('routes/user/user-layout.tsx', [route('user/profile', 'routes/user/profile.tsx')]),
] satisfies RouteConfig;
