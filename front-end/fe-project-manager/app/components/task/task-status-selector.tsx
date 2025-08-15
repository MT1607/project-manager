import type { TaskStatus } from '~/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useUpdateTaskStatusMutation, useUpdateTaskTitleMutation } from '~/hooks/use-task';
import { toast } from 'sonner';

const TaskStatusSelector = ({ status, taskId }: { status: TaskStatus; taskId: string }) => {
  const { mutate, isPending } = useUpdateTaskStatusMutation();

  const handleValueChange = (value: string) => {
    mutate(
      { taskId, status: value as TaskStatus },
      {
        onSuccess: () => {
          toast.success('Status updated successfully');
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };
  return (
    <Select value={status || ''} onValueChange={handleValueChange}>
      <SelectTrigger className='w-[180px]' disabled={isPending}>
        <SelectValue placeholder='Status'></SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value='To Do'>Todo</SelectItem>
        <SelectItem value='In Progress'>In Progress</SelectItem>
        <SelectItem value='Done'>Done</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TaskStatusSelector;
