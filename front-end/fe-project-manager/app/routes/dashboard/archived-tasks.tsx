import { useSearchParams } from 'react-router';
import { useGetArchivedTasks } from '@/hooks/use-workspace';
import type { Task } from '@/types';
import Loader from '@/components/loader';
import NoDataFound from '@/components/no-data-found';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router';

const ArchivedTasks = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('workspaceId');

  const { data, isLoading } = useGetArchivedTasks(workspaceId || '') as {
    data: {
      tasks: Task[];
      count: number;
    };
    isLoading: boolean;
  };

  // Show "No Workspace" message when no workspace is selected
  if (!workspaceId) {
    return (
      <div className='space-y-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Archived Tasks</h1>
        </div>

        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <h2 className='text-xl font-semibold text-gray-600 mb-2'>No Workspace Selected</h2>
            <p className='text-gray-500'>
              Please select a workspace from the dropdown above to view archived tasks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Archived Tasks</h1>
        {data && data.count > 0 && (
          <span className='text-sm text-gray-500'>
            {data.count} archived task{data.count !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className='space-y-4'>
        {!data || data.tasks.length === 0 ? (
          <NoDataFound
            title='No archived tasks found'
            description='Tasks that have been archived will appear here'
            buttonText=''
            buttonAction={() => {}}
            hideButton={true}
          />
        ) : (
          data.tasks.map((task) => (
            <Card key={task._id} className='hover:shadow-md transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-start space-x-3'>
                  <div
                    className={cn(
                      'mt-0.5 rounded-full p-1',
                      task.priority === 'High' && 'bg-red-100 text-red-700',
                      task.priority === 'Medium' && 'bg-yellow-100 text-yellow-700',
                      task.priority === 'Low' && 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {task.status === 'Done' ? (
                      <CheckCircle2 className='w-4 h-4' />
                    ) : (
                      <Circle className='w-4 h-4' />
                    )}
                  </div>
                  <div className='flex-1'>
                    <CardTitle className='text-lg'>
                      <Link
                        to={`/workspaces/${workspaceId}/projects/${task.project._id}/tasks/${task._id}`}
                        className='hover:text-blue-600 transition-colors'
                      >
                        {task.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className='mt-1'>
                      <div className='flex items-center space-x-4 text-sm'>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          task.status === 'Done' && 'bg-green-100 text-green-700',
                          task.status === 'In Progress' && 'bg-blue-100 text-blue-700',
                          task.status === 'To Do' && 'bg-gray-100 text-gray-700',
                          task.status === 'Review' && 'bg-yellow-100 text-yellow-700'
                        )}>
                          {task.status}
                        </span>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          task.priority === 'High' && 'bg-red-100 text-red-700',
                          task.priority === 'Medium' && 'bg-yellow-100 text-yellow-700',
                          task.priority === 'Low' && 'bg-gray-100 text-gray-700'
                        )}>
                          {task.priority} Priority
                        </span>
                        {task.dueDate && (
                          <span className='text-gray-500'>
                            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pt-0'>
                {task.description && (
                  <p className='text-sm text-gray-600 line-clamp-2'>{task.description}</p>
                )}
                <div className='mt-3 flex items-center justify-between'>
                  <div className='text-sm text-gray-500'>
                    Project: <span className='font-medium'>{task.project.title}</span>
                  </div>
                  <div className='text-xs text-gray-400'>
                    Archived: {format(new Date(task.updatedAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ArchivedTasks;