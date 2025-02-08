import { useEffect, useState } from "react"

export default function ReplySection({ postId, commentId, userId, setPosts, setComments, setReplies, setReply, setShowReplies, getReplies, parent, editComment, setEditComment })
{
  const [content, setContent] = useState('')

  useEffect(() => {
    if(parent==='edit' && editComment?.comment?.comment)
    {
      setContent(() => editComment.comment.comment)
    }
  }, [editComment?.comment?.comment])

  const handleReply = async() => {
    try
    {
      const response = await fetch(`/api/post/${postId}/user/${userId}/add-comment?parentId=${commentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content
        })
      })

      const reply = await response.json()
      if(response.ok)
      {
        setShowReplies(() => false)
        setPosts(prev => prev.map(post => post._id===postId?reply.post:post))
        setComments(prev => prev.map(comment => comment.commentId===commentId?{...comment, replies: comment.replies + 1}:comment))
        setReplies(prev => [{
          commentId: reply.commentId,
          parentId: reply.parentId,
          userId: reply.userId,
          pfp: reply.pfp,
          username: reply.username,
          role: reply.role,
          comment: reply.comment,
          likeStatus: reply.likeStatus,
          likes: reply.likes,
          replies: reply.replies,
          created: reply.created,
          edited: reply.edited
        }, ...prev])
        setContent(() => '')
        setReply(() => false)
        getReplies()
        setTimeout(() => {
          setShowReplies(() => true)
        }, 1)
      }
      else
      {
        console.error('Error replying on the comment:', reply.message)
      }
    }
    catch (error) {
      console.error('Error replying on the comment:', error)
    }
  }

  const updateComment = async() => {
    try
    {
      const response = await fetch(`/api/comment/update-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          comment: editComment.comment,
          content
        })
      })

      const data = await response.json()

      if(response.ok)
      {
        setEditComment(prev => {
          return {
            comment: {
              ...prev.comment,
              comment: data.updatedComment.content,
              edited: true
            },
            updated: true,
            show: false
          }
        })
      }
      else
      {
        console.error('Error updating comment:', data.message)
      }
    }
    catch(err)
    {
      console.error('Error updating comment:', err)
    }
  }
  
  return (
    <div className={`flex gap-2 ${parent==='edit'?'flex-col items-end':'items-center'}`}>
      <textarea
        onChange={(e) =>
          setContent(() => e.target.value)
        }
        value={content}
        placeholder={parent==='edit'?'Update comment...':'Add a reply...'}
        className='flex-1 w-full transition-all duration-300 px-4 py-2 border rounded-full bg-gray-100 dark:bg-slate-900 dark:border-slate-700 focus:m-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-1
          dark:text-white resize-none overflow-auto scrollbar leading-6'
        rows='1'
      />

      {parent==='edit'?
        <div className='flex gap-2'>
          <button
            onClick={() => setEditComment({show: false})}
            className="transition-all duration-300
              px-4 py-2 rounded-full
              dark:text-gray-200 dark:hover:text-gray-300 text-gray-600 hover:text-white dark:bg-slate-700 bg-gray-200 dark:hover:bg-slate-800 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            disabled={!content.trim() || content===editComment.comment.comment}
            onClick={() => updateComment()}
            className="transition-all duration-300
              bg-cyan-600 text-white px-4 py-2 rounded-full disabled:dark:bg-slate-600 disabled:bg-gray-400
              hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 focus:ml-1 focus:mb-1 focus:mt-1"
          >
            Update
          </button>
        </div>
        :
        <button
          disabled={!content.trim()}
          onClick={() => handleReply()}
          className="transition-all duration-300
                          bg-cyan-600 text-white px-4 py-2 rounded-full disabled:dark:bg-slate-600 disabled:bg-gray-400
                          hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 focus:ml-1 focus:mb-1 focus:mt-1"

        >
          Reply
        </button>
      }
    </div>
  )
}