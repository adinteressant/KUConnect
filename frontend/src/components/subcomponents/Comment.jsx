import { Link } from "react-router-dom"
import formatTimeAgo from "../../utils/generateTimeAgo.js"

export default function Comment({ comment, replyTo, setReplyTo })
{

  return (
    <>
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
            <button className='group' onClick={() => setReplyTo(prev => prev === comment.commentId ? false : comment.commentId)}>
              <svg width='18' height='18' viewBox='0 0 24 24'
                className={`transition-all duration-300 fill-none
                            ${replyTo === comment.commentId
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
          {comment.replies > 0 &&
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
    </>
  )
}