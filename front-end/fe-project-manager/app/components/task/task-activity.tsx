import { useQuery } from '@tanstack/react-query';
import { getData } from '~/lib/fetch-utils';
import Loader from '../loader';
import type { ActivityLog } from '~/types';
import { getActivityIcon } from './task-icon';

const TaskActivity = ({ resourceId }: { resourceId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ['task-activity', resourceId],
    queryFn: () =>
      getData<{ activity: ActivityLog[] }>(`/tasks/${resourceId}/activity`).then(
        (res) => res.activity
      ),
  }) as {
    data: ActivityLog[];
    isPending: boolean;
  };
  if (isPending) return <Loader />;

  return (
    <div className='bg-card rounded-lg p-6 shadow-sm'>
      <div className='text-lg text-muted-foreground mb-4'>Activity</div>

      <div className='space-y-4'>
        {(!data || data.length === 0) && (
          <div className='text-sm text-muted-foreground'>No activity yet.</div>
        )}
        {data &&
          data.map((activity) => (
            <div key={activity._id} className='flex gap-2'>
              <div className='flex items-center size-8 rounded-full bg-primary/10 justify-center text-primary'>
                {getActivityIcon(activity.action)}
              </div>

              <div>
                <p className='text-sm'>
                  <span className='font-medium'>{activity.user.name}</span>{' '}
                  {activity.details?.description}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TaskActivity;
