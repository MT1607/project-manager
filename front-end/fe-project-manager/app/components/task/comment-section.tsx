import { useState } from 'react';
import type { User, Comment as CommentType } from '~/types';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useAddCommentMutation, useTaskByIdQuery } from '~/hooks/use-task';

const CommentSection = ({
  taskId,
  members,
}: {
  taskId: string;
  members: { user: User; role: 'admin' | 'manager' | 'contributor' | 'viewer' }[];
}) => {
  const [newComment, setNewComment] = useState('');
  const { mutate: addComment, isPending } = useAddCommentMutation();
  const { data } = useTaskByIdQuery(taskId) as {
    data?: { task: { comments: CommentType[] } };
  };

  const handleAddComment = () => {
    const text = newComment.trim();
    if (!text) return;
    addComment(
      { taskId, text },
      {
        onSuccess: () => {
          setNewComment('');
        },
      }
    );
  };
  return (
    <div className='bg-card rounded-lg p-6 shadow-sm'>
      <h3 className='text-lg font-medium mb-4'>Comments</h3>
      <ScrollArea className='h-[300px] mb-4'>
        <div className='space-y-4 pr-2'>
          {(data?.task.comments || []).map((comment) => (
            <div key={comment._id} className='p-3 rounded-md border'>
              <div className='text-sm font-medium'>{comment.author?.name || 'User'}</div>
              <div className='text-sm text-muted-foreground whitespace-pre-wrap'>
                {comment.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator className='my-4' />
      <div className='mt-4'>
        <Textarea
          placeholder='Add new comment'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className='flex justify-end mt-4'>
          <Button disabled={!newComment.trim() || isPending} onClick={handleAddComment}>
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
