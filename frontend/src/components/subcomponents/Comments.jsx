import Comment from './Comment'

export default function Comments({ category, comments, postId, userId, setPosts, setComments })
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
            <Comment category={category} comment={comment} postId={postId} userId={userId} setPosts={setPosts} setComments={setComments}/>
          </div>
        )
      })}
    </>
  )
}