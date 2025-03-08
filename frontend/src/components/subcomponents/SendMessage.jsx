import { useState } from 'react'
import useSendMessage from '../hooks/useSendMessage'
import { Send, Loader2 } from 'lucide-react' // Add this import
import useReply from '../../zustand/useReply'
import useEditMessage from '../../zustand/useEditMessage'
import { useEditExistingMessage } from '../hooks/useEditExistingMessage'

export default function SendMessage(){

  const [message,setMessage] = useState('')
  const {replyOf,setReplyOf,setReply} = useReply()
  const {loading,sendMessage} = useSendMessage(replyOf)
  const {edit,setEdit,editMessage,setEditMessage,editMessageId} = useEditMessage()
  const {loadingEdit,editExistingMessage} = useEditExistingMessage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setReplyOf({})
    setReply(false)
    if(edit && editMessage) {
      await editExistingMessage(editMessage,editMessageId)
      setEditMessage('')
      setMessage('')
      setEdit(false)
      return
    }
    if(!message) return
    await sendMessage(message, null, null)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-slate-800 dark:bg-slate-800 p-4">
      <div className="flex gap-2 overflow-hidden ">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 rounded-full px-4 py-2 border border-gray-300 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-600
          dark:border-slate-700"
          value={edit? editMessage:message}
          onChange={(e) => {
            if(edit) setEditMessage(e.target.value)
            
              setMessage(e.target.value)
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-700 text-white rounded-full p-2 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:opacity-50"
        >
          {(loading || loadingEdit) ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}
