import { useState } from "react"
import { Link } from "react-router-dom"
import { createPortal } from "react-dom"
import formatTimeAgo from "../../utils/generateTimeAgo.js"
import Comments from "./Comments.jsx"
import ReplySection from "./ReplySection.jsx"
import { Loader2 } from "lucide-react"

export default function Comment({ category, comment, postId, userId, setPosts, setComments, setParents, setShowParentReplies, setStudent, setFaculty })
{
  const [reply, setReply] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState([])
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [showCommentOptions, setShowCommentOptions] = useState(false)
  const [openDeleteOverlay, setOpenDeleteOverlay] = useState(false)
  const [deleteLoadingState, setDeleteLoadingState] = useState(false)

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

  const likeComment = async() => {
    try
    {
      const response = await fetch(`/api/comment/${comment.commentId}/user/${userId}/like-comment`, {
        method: 'POST'
      })

      const data = await response.json()

      if(response.ok)
      {
        setComments(prev =>
          prev.map(c =>
            c.commentId===comment.commentId?
            {...c, likes: data.commentLikes, likeStatus: data.likeStatus}
            :c
          )
        )
      }
      else
      {
        console.error('Error liking comment:', data.message)  
      }
    }
    catch(err)
    {
      console.error('Error liking comment:', err)
    }
  }

  const deleteComment = async() => {
    try
    {
      const response = await fetch(`/api/comment/delete-comment`, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          postId,
          comment
        })
      })

      const data = await response.json()

      if(response.ok)
      {
        setPosts(prev => prev.map(p => p._id===postId?{...p, comments: data.post.comments}:p))
        if(comment.parentId)
        {
          setParents(prev => prev.map(c => c.commentId===comment.parentId?{...c, replies: data.parent.replies}:c))
          setShowParentReplies(() => false)
          if(data.parent.replies)
          {  
            setTimeout(() => {
              setShowParentReplies(() => true)
            }, 1)
          }
        }
        else
        {
          if(comment.role==='student')
          {
            setStudent(prev => prev-1)
          }
          if(comment.role==='faculty')
          {
            setFaculty(prev => prev-1)
          }
        }
        setComments(prev => prev.map(c => c.commentId===comment.commentId?false:c))
        setShowReplies(() => false)
        setOpenDeleteOverlay(() => false)
        setDeleteLoadingState(() => false)
      }
      else
      {
        console.error('Error getting replies:', data.message)
      }
    }
    catch(err)
    {
      console.log('Error getting replies:', err)
    }
  }

  return (
    <>
      {comment &&
      <>
        <div className="flex flex-col">
          <div className='group/comment flex pr-4'>
            <Link className='mt-2 shrink-0 mb-auto' to={`/${comment.username}`}>
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
                  <button 
                    className='group'
                    onClick={() => likeComment()}
                  >
                    <svg width='18' height='18' viewBox='0 0 24 24'
                      className={`transition-all duration-300 ${comment.likeStatus
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
              <div className='flex items-center gap-4 ml-2 mt-1 text-gray-600 text-xs'>
                <div>
                  {formatTimeAgo(comment.created)} ago
                </div>
                
                {comment.edited &&
                  <div>
                    Edited
                  </div>
                }

                {comment.likes > 0 &&
                  <button>
                    Likes: {comment.likes}
                  </button>
                }

                {userId === comment.userId &&
                <div className='relative flex items-end' onMouseLeave={() => setShowCommentOptions(() => false)}>

                  <div className={`absolute right-full rounded-lg shadow-2xl text-sm bg-gray-100 dark:bg-slate-900 border dark:border-slate-700 border-gray-200 transition-all duration-300 overflow-hidden ${showCommentOptions?'opacity-100 max-h-screen':'opacity-0 max-h-0'}`}>
                    
                    <button
                      disabled={!showCommentOptions}
                      // onClick={() => openEditOverlay(post)}
                      className={`w-[100%] group/edit flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 dark:hover:text-cyan-600 hover:text-cyan-600 dark:hover:bg-gray-700 hover:bg-gray-200 hover:shadow-inner transition-all duration-300`}
                    >
                      <svg className='stroke-gray-600 dark:stroke-gray-400 fill-none stroke-2 group-hover/edit:stroke-cyan-600 transition-all duration-300' width="16" height="16" viewBox="0 0 24 24">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                      </svg>
                      <div>
                        Edit
                      </div>
                    </button>

                    <button
                      disabled={!showCommentOptions}
                      onClick={() => setOpenDeleteOverlay(() => true)}
                      className={`w-[100%] group/del flex items-center gap-2 border-t dark:border-slate-700 border-gray-200 p-2 text-red-600 hover:text-red-700 dark:hover:bg-gray-700 hover:bg-gray-200 hover:shadow-inner transition-all duration-300`}
                    >
                      <svg className='stroke-red-600 fill-none stroke-2 group-hover/del:stroke-red-700 transition-all duration-300' width="16" height="16" viewBox="0 0 24 24">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      <div>
                        Delete
                      </div>
                    </button>
                  </div>
                  
                  <button
                    className='opacity-0 group-hover/comment:opacity-100 rounded-full hover:text-cyan-600'
                    onClick={() => setShowCommentOptions((prev) => !prev)}
                  >
                    <svg width="16" viewBox="0 0 24 24"
                      className='fill-none stroke-1 stroke-current'
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>}
              </div>
            </div>
          </div>
            
          <div className={`transition-all duration-300 ease-in-out ${reply?'mt-2 pr-4 opacity-100 max-h-screen overflow-y-auto scrollbar':'mt-0 max-h-0 opacity-0 overflow-hidden'}`}>
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
            <div className="flex">
              <div className='border-l ml-4 pl-4 mt-4 flex flex-col gap-4 dark:border-slate-700'>
                {loadingReplies?
                <div className='flex items-center'>
                  <div className='shrink-0 w-8 h-8 rounded-full object-cover bg-gray-200 dark:bg-slate-800 animate-pulse'>
                  </div>
                  <div className='ml-2 min-w-[10%] w-48 max-w-[50%] h-14 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse'>
                  </div>
                </div>
                :
                <Comments category={category} comments={replies.filter(r => r.parentId===comment.commentId)} postId={postId} userId={userId} setPosts={setPosts} setComments={setReplies} setParents={setComments} setShowParentReplies={setShowReplies} />}
              </div>
            </div>
          }
        </div>

        {openDeleteOverlay &&
        createPortal(
          <div className={`fixed inset-0 z-[100]
                            flex items-center justify-center
                            bg-black transition-all duration-300
                            bg-opacity-50`}
          >
            <div className={`bg-white dark:bg-slate-900 min-w-[320px] w-[40%] max-w-[580px] min-h-36 max-h-[400px] rounded-xl shadow-2xl
                    transition-all duration-300
                    flex p-2`}
            >
              {deleteLoadingState ?
                <div className='m-auto text-lg text-gray-600 dark:text-gray-200 flex justify-center items-center gap-2'>
                  <div>
                    Deleting Comment
                  </div>
                  <Loader2 className="w-5 h-5 text-cyan-600 animate-spin" />
                </div>
                :
                <div>
                  <div className='m-3 mb-2 text-lg font-semibold dark:text-gray-200'>
                    Delete Comment
                  </div>
                  <div className='m-3 my-2 dark:text-gray-200'>
                    Once deleted, this comment cannot be restored. Are you sure you want to delete it permanently?
                  </div>
                  <div className='flex justify-end gap-2 m-2'>
                    <button className='py-2 px-4 rounded-xl dark:text-gray-200 dark:hover:text-gray-300 text-gray-600 hover:text-white dark:bg-slate-700 bg-gray-200 dark:hover:bg-slate-800 hover:bg-gray-400'
                      onClick={() => setOpenDeleteOverlay(() => false)}>
                      Cancel
                    </button>
                    <button className='py-2 px-4 rounded-xl dark:text-gray-200 dark:hover:text-gray-300 text-white bg-red-600 hover:bg-red-700'
                      onClick={() => {
                        setDeleteLoadingState(() => true)
                        deleteComment()
                      }}>
                      Delete
                    </button>
                  </div>
                </div>}
            </div>
          </div>,
          document.body
        )}
      </>}
    </>
  )
}