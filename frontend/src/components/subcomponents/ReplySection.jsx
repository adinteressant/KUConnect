import { useState } from "react"

export default function ReplySection({ postId, commentId }) {
  
  const [content, setContent] = useState('')

  const handleReply = async() => {
    await fetch('')
  }
  
  return (
    <div className='p-2 flex flex-col gap-2 dark:bg-slate-800'>
      <div className='flex'>
        <textarea
          onChange={(e) =>
            setContent(() => e.target.value)
          }
          value={content}
          placeholder="Add a reply..."
          className='flex-1 transition-all duration-300 p-2 border rounded-lg bg-gray-100 dark:bg-slate-900 dark:border-slate-700 focus:m-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-1
                                    resize-none overflow-auto leading-6'
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