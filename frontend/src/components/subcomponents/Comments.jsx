import Comment from './Comment'

export default function Comments({ category, comments, replyTo, setReplyTo })
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
          <div key={index} className='flex'>
            <Comment comment={comment} replyTo={replyTo} setReplyTo={setReplyTo}/>
          </div>
        )
      })}
    </>
  )
}