import Comment from './Comment'

export default function Comments({ category, comments, replyTo, setReplyTo, postId, userId })
{
  return (
    <>
      {comments.map((comment, index) => {
        if (comment.role === 'student') {
          if (category === 'faculty') {
            return;
          }
        }
        if (comment.role === 'faculty') {
          if (category === 'student') {
            return;
          }
        }
        return (
          <div key={index}>
            <Comment category={category} comment={comment} replyTo={replyTo} setReplyTo={setReplyTo} postId={postId} userId={userId} />
          </div>
        )
      })}
    </>
  )
}