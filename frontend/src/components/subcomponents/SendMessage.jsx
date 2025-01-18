import { useState } from 'react'
import useSendMessage from '../hooks/useSendMessage'
import { Send, Loader2 } from 'lucide-react' // Add this import


export default function SendMessage(){

  const [message,setMessage] = useState('')
  const {loading,sendMessage} = useSendMessage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!message) return
    await sendMessage(message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:bg-slate-900 p-4">
      <div className="flex gap-2 overflow-hidden ">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}