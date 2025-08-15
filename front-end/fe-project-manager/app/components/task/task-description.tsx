import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateTaskDescriptionMutation } from '~/hooks/use-task';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const TaskDecription = ({ description, taskId }: { description: string; taskId: string }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const { mutate, isPending } = useUpdateTaskDescriptionMutation();

  const updateDescription = () => {
    mutate(
      { taskId, description: newDescription },
      {
        onSuccess: () => {
          setIsEditting(false);
          toast.success('Description is updated successfully');
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
        <Textarea
          className='w-full min-w-3xl'
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <h2 className='text-sm md:text-base text-pretty flex-1 text-muted-foreground'>
          {description}
        </h2>
      )}

      {isEditting ? (
        <Button className='py-0' size={'sm'} onClick={updateDescription} disabled={isPending}>
          Save
        </Button>
      ) : (
        <Edit className='size-3 cursor-pointer' onClick={() => setIsEditting(true)}></Edit>
      )}
    </div>
  );
};

export default TaskDecription;
