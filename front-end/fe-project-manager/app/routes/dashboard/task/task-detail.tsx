import { formatDistanceToNow } from 'date-fns';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { BackButton } from '~/components/back-button';
import Loader from '~/components/loader';
import SubtaskDetail from '~/components/task/sub-task';
import TaskActivity from '~/components/task/task-activity';
import TaskAssigneesSelector from '~/components/task/task-assignees-selector';
import TaskDecription from '~/components/task/task-description';
import TaskPrioritySelector from '~/components/task/task-priority-selector';
import TaskStatusSelector from '~/components/task/task-status-selector';
import TaskTitle from '~/components/task/task-title';
import Watchers from '~/components/task/watcher';
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

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='lg:col-span-2'>
          <div className='bg-card rounded-lg p-6 shadow-sm'>
            <div className='flex flex-col md:flex-row justify-between items-start mb-4'>
              <div>
                <TaskTitle title={task.title} taskId={task._id} />

                <div className='text-sm text-muted-foreground'>
                  Create at{' '}
                  {formatDistanceToNow(new Date(task.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className='flex items-center gap-2 mt-4 md:mt-0'>
                <TaskStatusSelector status={task.status} taskId={task._id} />

                <Button
                  variant={'destructive'}
                  size={'sm'}
                  onClick={() => {}}
                  className='hidden md:block'
                >
                  Delete Task
                </Button>
              </div>
            </div>

            <div className='mb-6'>
              <h3 className='text-sm font-medium text-muted-foreground mb-0'>Description</h3>

              <TaskDecription description={task.description || ''} taskId={task._id} />
            </div>

            <TaskAssigneesSelector
              task={task}
              assignees={task.assignees}
              projectMembers={project.members}
            />

            <TaskPrioritySelector priority={task.priority} taskId={task._id} />

            <SubtaskDetail subTasks={task.subtasks || []} taskId={task._id} />

            {/* {right-sides} */}
          </div>
        </div>

        <div className='w-full'>
          <Watchers watchers={task.watchers || []} />

          <TaskActivity resourceId={task._id} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
