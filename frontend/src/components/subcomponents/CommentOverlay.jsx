import { React, useState, useEffect } from "react"
import ReplySection from "./ReplySection.jsx"
import Comments from "./Comments.jsx"

function ShowComments({ postId, userProfile, setPosts }) {

  const [comments, setComments] = useState([])
  const [category, setCategory] = useState('all')
  const [student, setStudent] = useState(0)
  const [faculty, setFaculty] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(() => true)
    fetch(`/api/post/${postId}/user/${userProfile.user_id}/get-comments`)
      .then(response => response.json())
      .then(data => {
        setComments(() => data.comments)
        let s = 0, f = 0
        data.comments.forEach((comment) => {
          if (comment.role === 'student') {
            s++
          }
          if (comment.role === 'faculty') {
            f++
          }
        })
        setStudent(() => s)
        setFaculty(() => f)
        setLoading(() => false)
      })
      .catch((error) => {
        console.error('Error getting comments: ', error)
      })
  }, [])

  return (
    <>
      {loading ?
        (<div className='flex flex-col w-[100%] h-[100%] dark:bg-slate-900'>
          <div className='p-2 flex gap-2 border-b dark:border-slate-700'>
            {[1, 2, 3].map((_, index) => (
              <button key={index} className={`pl-8 pr-8 pt-4 pb-4 rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse`}>
              </button>
            ))}
          </div>
          <div className='p-4 overflow-hidden flex flex-col gap-8 w-[100%] h-[100%]'>
            {[1, 2, 3, 4].map((_, index) => (<div key={index} className='flex'>
              <div className='mt-2 shrink-0 w-8 h-8 rounded-full object-cover bg-gray-200 dark:bg-slate-800 animate-pulse'>
              </div>
              <div className='ml-2 bg-gray-200 dark:bg-slate-800 w-[50%] h-[120%] rounded-xl animate-pulse object-cover'>
              </div>
            </div>))}
          </div>
        </div>) :
        (<div className='flex-1 flex flex-col overflow-y-auto scrollbar'>
          <div className='p-2 flex gap-2 border-b dark:border-slate-700'>
            <button onClick={() => setCategory(() => 'all')} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ${category === 'all' ? 'bg-gray-200 dark:text-white dark:bg-gray-700' : 'dark:bg-slate-900 dark:text-gray-400'}`}>
              All({student + faculty})
            </button>
            <button onClick={() => setCategory(() => 'student')} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ${category === 'student' ? 'bg-gray-200 dark:text-white dark:bg-gray-700 ' : 'dark:bg-slate-900 dark:text-gray-400'}`}>
              Students({student})
            </button>
            <button onClick={() => setCategory(() => 'faculty')} className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ${category === 'faculty' ? 'bg-gray-200 dark:text-white dark:bg-gray-700' : 'dark:bg-slate-900 dark:text-gray-400'}`}>
              Faculty({faculty})
            </button>
          </div>
          <div className='p-4 flex-1 overflow-y-auto scrollbar flex flex-col gap-4'>
            
            {category==='all' ||
            <div className='text-xs text-gray-400 dark:text-gray-500'>
              {`Comments and replies by ${category==='faculty'?'students':'faculties'} are hidden`}
            </div>}
            <Comments category={category} comments={comments} postId={postId} userId={userProfile.user_id} setPosts={setPosts} setComments={setComments}/>
            {(comments.length===0 || (category === 'faculty' && faculty === 0) || (category === 'student' && student === 0)) && <div className="leading-none m-auto text-gray-600">No comments</div>}
          </div>
        </div>)}
        {/* <div className={`transition-all duration-500 ease-in-out ${replyTo?'opacity-100 max-h-screen overflow-y-auto scrollbar':'opacity-0 max-h-0 overflow-hidden'}`}>
          <ReplySection commentId={replyTo} postId={postId} userId={userProfile.user_id} setComments={setComments} setPosts={setPosts} setReplyTo={setReplyTo}/>
        </div> */}
    </>
  );
}

export default ShowComments