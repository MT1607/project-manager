import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import { useUpdateTaskTitleMutation } from '~/hooks/use-task';
import { toast } from 'sonner';

interface TaskTitleProps {
  title: string;
  taskId: string;
}

const TaskTitle = ({ title, taskId }: TaskTitleProps) => {
  const [isEditting, setIsEditting] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate, isPending } = useUpdateTaskTitleMutation();

  const updateTitle = () => {
    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditting(false);
          toast.success('Title is updated successfully');
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className='flex items-center gap-2'>
      {isEditting ? (
        <Input
          className='!text-xl font-semibold w-full min-w-3xl'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <h2 className='text-xl flex-1 font-semibold'>{title}</h2>
      )}

      {isEditting ? (
        <Button className='py-0' size={'sm'} onClick={updateTitle} disabled={isPending}>
          Save
        </Button>
      ) : (
        <Edit className='size-3 cursor-pointer' onClick={() => setIsEditting(true)}></Edit>
      )}
    </div>
  );
};

export default TaskTitle;
