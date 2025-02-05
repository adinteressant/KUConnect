import { useState } from 'react'
import Comment from './Comment'

export default function Comments({ category, comments, postId, userId, setPosts, setComments })
{
  const [studentHidden, setStudentHidden] = useState(false)
  const [facultyHidden, setFacultyHidden] = useState(false)

  return (
    <>
      {(studentHidden && category==='faculty') &&
      <div className='text-xs text-gray-400 dark:text-gray-500'>
        {`Comments by student are hidden`}
      </div>}

      {(facultyHidden && category==='student') &&
      <div className='text-xs text-gray-400 dark:text-gray-500'>
        {`Comments by faculty are hidden`}
      </div>}

      {comments.map((comment, index) => {
        if (comment.role === 'student') {
          if (category === 'faculty') {
            if(!studentHidden) {
              setStudentHidden(() => true)
            }
            return;
          }
        }
        if (comment.role === 'faculty') {
          if (category === 'student') {
            if(!facultyHidden) {
              setFacultyHidden(() => true)
            }
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