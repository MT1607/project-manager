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
      return getData(`/workspaces/${workspaceId}/stats`);
    },
  });
};

export { useCreateWorkspace, useGetWorkspace, useGetWorkspaceId, useGetWorkspaceStatsQuery };
