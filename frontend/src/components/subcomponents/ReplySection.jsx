import { useState } from "react"

export default function ReplySection({ postId, commentId, userId, setPosts, setComments, setReplies, setReply }) {
  
  const [content, setContent] = useState('')

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
        setPosts(prev => prev.map(post => post._id===postId?reply.post:post))
        setComments(prev => prev.map(comment => comment.commentId===commentId?{...comment, replies: comment.replies + 1}:comment))
        setReplies(prev => [...prev, {
          commentId: reply.commentId,
          pfp: reply.pfp,
          username: reply.username,
          role: reply.role,
          comment: reply.comment,
          likeStatus: reply.likeStatus,
          likes: reply.likes,
          replies: reply.replies,
          created: reply.created
        }])
        setContent(() => '')
        setReply(() => false)
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
  
  return (
    <div className='flex items-center gap-2'>
      <textarea
        onChange={(e) =>
          setContent(() => e.target.value)
        }
        value={content}
        placeholder="Add a reply..."
        className='flex-1 transition-all duration-300 px-4 py-2 border rounded-full bg-gray-100 dark:bg-slate-900 dark:border-slate-700 focus:m-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-1
          dark:text-white resize-none overflow-auto scrollbar leading-6'
        rows='1'
      />
      <button
        disabled={!content.trim()}
        onClick={() => handleReply()}
        className="transition-all duration-300
                        bg-cyan-600 text-white px-4 py-2 rounded-full disabled:dark:bg-slate-600 disabled:bg-gray-400
                        hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 focus:ml-1 focus:mb-1 focus:mt-1"

      >
        Reply
      </button>
    </div>
  )
}