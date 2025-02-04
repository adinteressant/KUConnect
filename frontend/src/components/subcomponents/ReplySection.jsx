import { useState } from "react"

export default function ReplySection({ postId, commentId, userId, setComments, setPosts, setReplyTo }) {
  
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
        setReplyTo(() => false)
        setContent(() => '')
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
    <div className='mt-auto rounded-b-lg p-3 flex flex-col gap-2 border-t dark:border-slate-700'>
      <div className='flex'>
        <textarea
          onChange={(e) =>
            setContent(() => e.target.value)
          }
          value={content}
          placeholder="Add a reply..."
          className='flex-1 transition-all duration-300 p-2 border rounded-lg bg-gray-100 dark:bg-slate-900 dark:border-slate-700 focus:m-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-1
            dark:text-white resize-none overflow-auto scrollbar leading-6'
          rows='2'
        />
      </div>
      <button
        disabled={!content.trim()}
        onClick={() => handleReply()}
        className="transition-all duration-300
                        mr-auto bg-cyan-600 text-white px-4 py-2 rounded-lg disabled:dark:bg-slate-600 disabled:bg-gray-400
                        hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 focus:ml-1 focus:mb-1 focus:mt-1"

      >
        Reply
      </button>
    </div>
  )
}