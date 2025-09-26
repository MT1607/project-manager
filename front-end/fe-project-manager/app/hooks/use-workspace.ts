import { useMutation, useQuery } from '@tanstack/react-query';
import type { WorkspaceForm } from '@/components/workspace/create-workspace';
import { getData, postData } from '@/lib/fetch-utils';

const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: (data: WorkspaceForm) => postData('/workspaces ', data),
  });
};

const useGetWorkspace = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => getData('/workspaces'),
  });
};

const useGetWorkspaceId = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspace', 'projects'],
    queryFn: async () => getData(`/workspaces/${workspaceId}/projects`),
  });
};

const useGetWorkspaceStatsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspace', 'stats', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        return null;
      }
      return getData(`/workspaces/${workspaceId}/stats`);
    },
    enabled: !!workspaceId, // Only run the query when workspaceId is provided
  });
};

const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspace', workspaceId, 'details'],
    queryFn: async () => getData(`/workspaces/${workspaceId}`),
  });
};

const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};

const useAcceptInviteByTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      postData(`/workspaces/accept-invite-token`, {
        token,
      }),
  });
};

const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};

const useGetArchivedTasks = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspace', workspaceId, 'archived-tasks'],
    queryFn: async () => getData(`/tasks/workspace/${workspaceId}/archived`),
    enabled: !!workspaceId,
  });
};

export {
  useCreateWorkspace,
  useGetWorkspace,
  useGetWorkspaceId,
  useGetWorkspaceStatsQuery,
  useGetWorkspaceDetailsQuery,
  useAcceptGenerateInviteMutation,
  useInviteMemberMutation,
  useAcceptInviteByTokenMutation,
  useGetArchivedTasks,
};
