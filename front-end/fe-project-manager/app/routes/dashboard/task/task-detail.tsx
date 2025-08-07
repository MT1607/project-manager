import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { BackButton } from '~/components/back-button';
import Loader from '~/components/loader';
import TaskTitle from '~/components/task/task-title';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { useTaskByIdQuery } from '~/hooks/use-task';
import { useAuth } from '~/provider/auth-context';
import type { Project, Task } from '~/types';

const TaskDetail = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();

  const navigate = useNavigate();

  const { data, isLoading } = useTaskByIdQuery(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-2xl font-bold'>Task not found</div>
      </div>
    );
  }

  const { task, project } = data;

  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id.toString() === user?._id.toString()
  );

  const goBack = () => navigate(-1);

  const member = task?.assignees || [];

  return (
    <div className='container mx-auto p-0 py-4 md:px-8'>
      <div className='flex flex-col md:flex-row items-center justify-between mb-6'>
        <div className='flex flex-col md:flex-row md:items-center'>
          <BackButton />
          <h1 className='text-xl md:text-2xl font-bold'>{task.title}</h1>

          {task.isArchived && (
            <Badge variant={'outline'} className='ml-2'>
              Archived
            </Badge>
          )}
        </div>
        <div className='flex space-x-2 mt-4 md:mt-0'>
          <Button variant={'outline'} size={'sm'} onClick={() => {}} className='w-fit'>
            {isUserWatching ? (
              <>
                <EyeOff className='mr-2 size-4' />
                Unwatch
              </>
            ) : (
              <>
                <Eye className='mr-2 size-4'>Watch</Eye>
              </>
            )}
          </Button>

          <Button variant={'outline'} size={'sm'} onClick={() => {}} className='w-fit'>
            {task.isArchived ? 'Unarchived' : 'Archive'}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='lg:col-span-2'>
          <div className='bg-card rounded-lg p-6 shadow-sm'>
            <div className='flex flex-col md:flex-row justify-between items-start mb-4'>
              <div>
                <Badge
                  variant={
                    task.priority === 'High'
                      ? 'destructive'
                      : task.priority === 'Medium'
                        ? 'default'
                        : 'secondary'
                  }
                  className='mb-2 capitalize'
                >
                  {task.priority} Priority
                </Badge>

                <TaskTitle title={task.title} taskId={task._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
