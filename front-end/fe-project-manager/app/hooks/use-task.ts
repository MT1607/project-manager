import type {CreateTaskFormData} from "~/components/create-task-dialog";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postData} from "~/lib/fetch-utils";

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { projectId: string; taskData: CreateTaskFormData }) =>
            postData(`/tasks/${data.projectId}/create-task`, data.taskData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["project", data.project],
            });
        },
    });
};