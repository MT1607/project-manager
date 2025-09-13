import { useState } from 'react';
import type { Subtask } from '@/types';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAddSubtaskMutation, useUpdateSubtaskMutation } from '@/hooks/use-task';
import { toast } from 'sonner';

const SubtaskDetail = ({ subTasks, taskId }: { subTasks: Subtask[]; taskId: string }) => {
  const [newSubtask, setNewSubtask] = useState('');
  const { mutate: addSubtask, isPending } = useAddSubtaskMutation();
  const { mutate: updateSubtask, isPending: isUpdatedSubtask } = useUpdateSubtaskMutation();

  const handleToggleTask = (subTaskId: string, checked: boolean) => {
    console.log('subTaskId: ', subTaskId);
    console.log('completed: ', checked);
    updateSubtask(
      { taskId, subtaskId: subTaskId, completed: checked },
      {
        onSuccess: () => {
          toast.success(`Subtask marked as ${checked ? 'completed' : 'incomplete'}`);
        },
        onError: (error: any) => {
          console.log('error updated subtask: ', error);
          const errorMessage = error.response?.data?.message || 'Failed to update subtask';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(
        { taskId, title: newSubtask.trim() },
        {
          onSuccess: () => {
            setNewSubtask('');
            toast.success('Subtask added successfully');
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to add subtask';
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  return (
    <div className='mb-6 mt-2'>
      <h3 className='text-sm font-medium text-muted-foreground'>Sub Tasks</h3>
      <div className='space-y-2 mb-4'>
        {subTasks.length > 0 ? (
          subTasks.map((subTask) => (
            <div key={subTask._id} className='flex items-center space-x-2'>
              <Checkbox
                id={subTask._id}
                checked={subTask.completed}
                onCheckedChange={(checked: boolean) => {
                  handleToggleTask(subTask._id, !!checked);
                }}
                disabled={isUpdatedSubtask}
              />

              <label
                className={cn(
                  'text-sm',
                  subTask.completed ? 'line-through text-muted-foreground' : ''
                )}
              >
                {subTask.title}
              </label>
            </div>
          ))
        ) : (
          <div className='text-sm text-muted-foreground'>No sub tasks</div>
        )}
      </div>
      <div className='flex gap-2'>
        <Input
          placeholder='Add a subtask...'
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          className='mr-1 h-9'
        />
        <Button
          onClick={handleAddSubtask}
          disabled={!newSubtask.trim() || isPending}
          className='h-9'
        >
          <Plus /> Add
        </Button>
      </div>
    </div>
  );
};

export default SubtaskDetail;
