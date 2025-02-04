import { React, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import formatTimeAgo from "../../utils/generateTimeAgo.js"
import ReplySection from "./ReplySection.jsx"

function ShowComments({ postId, userProfile, setPosts }) {

  const [comments, setComments] = useState([])
  const [category, setCategory] = useState('all')
  const [student, setStudent] = useState(0)
  const [faculty, setFaculty] = useState(0)
  const [loading, setLoading] = useState(true)
  const [replyTo, setReplyTo] = useState(false)

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
                  <Link onClick={() => {
                  }} className='mt-2 shrink-0' to={`/${comment.username}`}>
                    <img src={`/api/get-pfp?id=${comment.pfp}`} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                  </Link>
                  <div className='ml-2'>
                    <div className='flex'>
                      <div className='bg-gray-100 dark:bg-slate-800 p-2 rounded-xl'>
                        <div className='flex gap-2 items-center'>
                          <Link onClick={() => {
                          }} to={`/${comment.username}`} className='text-gray-800 dark:text-slate-200 font-semibold text-sm'>
                            {comment.username}
                          </Link>
                          <div className='text-gray-600 dark:text-gray-400 text-xs'>
                            {comment.role.charAt(0).toUpperCase() + comment.role.slice(1)}
                          </div>
                        </div>
                        <div className='text-gray-800 dark:text-slate-200 break-all whitespace-normal'>
                          {comment.comment}
                        </div>
                      </div>
                      <div className='ml-2 flex flex-col justify-evenly'>
                        <button className='group'>
                          <svg width='18' height='18' viewBox='0 0 24 24'
                            className={`transition-all duration-300 ${false
                              ? 'stroke-cyan-600 fill-cyan-600 group-hover:fill-cyan-700 group-hover:stroke-cyan-700'
                              : 'stroke-gray-600 fill-none group-hover:stroke-cyan-600'}`}
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                          </svg>
                        </button>
                        <button className='group' onClick={() => setReplyTo(prev => prev===comment.commentId?false:comment.commentId)}>
                          <svg width='18' height='18' viewBox='0 0 24 24'
                            className={`transition-all duration-300 fill-none
                            ${replyTo===comment.commentId
                              ? 'stroke-cyan-600 group-hover:stroke-cyan-700'
                              : 'stroke-gray-600 group-hover:stroke-cyan-600'
                            }`}
                          >
                            <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className='flex items-center gap-4 ml-2 text-gray-600 text-xs'>
                      <div>
                        {formatTimeAgo(comment.created)} ago
                      </div>
                      {comment.likes>0 &&
                      <button>
                        Likes: {comment.likes}
                      </button>
                      }
                      {comment.replies>0 &&
                      <button>
                        Replies: {comment.replies}
                      </button>
                      }
                      <button>
                        <svg width="16" height="16" viewBox="0 0 24 24"
                          className='stroke-1 stroke-gray-600 dark:stroke-gray-400'>
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            {((category === 'faculty' && faculty === 0) || (category === 'student' && student === 0)) && <div className="leading-none m-auto text-gray-600">No comments</div>}
          </div>
        </div>)}
        <div className={`transition-all duration-500 ease-in-out ${replyTo?'opacity-100 max-h-screen overflow-y-auto scrollbar':'opacity-0 max-h-0 overflow-hidden'}`}>
          <ReplySection commentId={replyTo} postId={postId} userId={userProfile.user_id} setComments={setComments} setPosts={setPosts} setReplyTo={setReplyTo}/>
        </div>
    </>
  );
}

export default ShowComments