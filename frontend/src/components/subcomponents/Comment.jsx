import { useState } from "react"
import { Link } from "react-router-dom"
import formatTimeAgo from "../../utils/generateTimeAgo.js"
import Comments from "./Comments.jsx"
import ReplySection from "./ReplySection.jsx"

export default function Comment({ category, comment, postId, userId, setPosts, setComments })
{
  const [reply, setReply] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState([])
  const [loadingReplies, setLoadingReplies] = useState(false)

  const getReplies = async() =>
  {
    if(comment.replies!==replies.length)
    {
      setLoadingReplies(() => true)
      try
      {
        const response = await fetch(`/api/post/${postId}/user/${userId}/get-comments?parentId=${comment.commentId}`, {
          method:'GET'
        })

        const commentReplies = await response.json()

        if(response.ok)
        {
          setReplies(() => commentReplies.comments)
          setLoadingReplies(() => false)
        }
        else
        {
          console.error('Error getting replies:', commentReplies.message)
        }
      }
      catch(err)
      {
        console.log('Error getting replies:', err)
      }
    }
  }

  return (
    <>
    <div className="flex flex-col">
      <div className='flex'>
        <Link className='mt-2 shrink-0' to={`/${comment.username}`}>
          <img src={`/api/get-pfp?id=${comment.pfp}`} alt="profile" className="w-8 h-8 rounded-full object-cover" />
        </Link>
        <div className='ml-2'>
          <div className='flex'>
            <div className='bg-gray-100 dark:bg-slate-800 p-2 rounded-xl'>
              <div className='flex gap-2 items-center'>
                <Link to={`/${comment.username}`} className='text-gray-800 dark:text-slate-200 font-semibold text-sm'>
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
              <button className='group' onClick={() => setReply(prev => !prev)}>
                <svg width='18' height='18' viewBox='0 0 24 24'
                  className={`transition-all duration-300 fill-none
                              ${reply
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
            {comment.likes > 0 &&
              <button>
                Likes: {comment.likes}
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
        
      <div className={`mr-0 transition-all duration-300 ease-in-out ${reply?'mt-2 opacity-100 max-h-screen  scrollbar':'mt-0 max-h-0 opacity-0 overflow-hidden'}`}>
        <ReplySection postId={postId} commentId={comment.commentId} userId={userId} setPosts={setPosts} setComments={setComments} setReplies={setReplies} setReply={setReply} setShowReplies={setShowReplies} getReplies={getReplies}/>
      </div>
        
      {comment.replies > 0 &&
        <button 
          className={`mt-2 ml-[6px] mr-auto text-sm flex items-center gap-2 transition-all duration-300 ${showReplies?'text-cyan-600 hover:text-cyan-700':'text-gray-600 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-600'}`}
          onClick={() =>
            {
              setShowReplies(prev => !prev)
              getReplies()
            }
          }
        >
          {showReplies?
          <svg width="20" height="20" viewBox="0 0 24 24" className='stroke-current stroke-2 fill-none'>
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12h8"/>
          </svg>
          :
          <svg width="20" height="20" viewBox="0 0 24 24" className='stroke-current stroke-2 fill-none'>
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
          </svg>
          }
          <div>
            {showReplies?'Hide':'View'} {comment.replies} {comment.replies===1?'reply':'replies'}
          </div>
        </button>
      }
      
      {showReplies &&
      <div className='border-l ml-4 pl-4 mt-4 flex flex-col gap-4 dark:border-slate-700'>
        {loadingReplies?
        <div className='flex items-center'>
          <div className='shrink-0 w-8 h-8 rounded-full object-cover bg-gray-200 dark:bg-slate-800 animate-pulse'>
          </div>
          <div className='ml-2 min-w-[10%] w-48 max-w-[50%] h-14 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse'>
          </div>
        </div>
        :
        <Comments category={category} comments={replies.filter(r => r.parentId===comment.commentId)} postId={postId} userId={userId} setPosts={setPosts} setComments={setReplies} />}
      </div>
      }
    </div>
    </>
  )
}