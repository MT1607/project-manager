import type { CreateTaskFormData } from '~/components/task/create-task-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getData, postData, updateData } from '~/lib/fetch-utils';
import { data } from 'react-router';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string; taskData: CreateTaskFormData }) =>
      postData(`/tasks/${data.projectId}/create-task`, data.taskData),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ['project', data.project],
      });
    },
  });
};

export const useTaskByIdQuery = (taskId: string) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getData(`/tasks/${taskId}`),
  });
};

export const useUpdateTaskTitleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { taskId: string; title: string }) =>
      updateData(`/tasks/${data.taskId}/title`, { title: data.title }),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ['task', data._id],
      });
    },
  });
};
