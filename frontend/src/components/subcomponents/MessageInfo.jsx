import { useState } from 'react'
import useConversation from '../../zustand/useConversation'
import useReply from '../../zustand/useReply'
import { Loader2 } from 'lucide-react'
import useEditMessage from '../../zustand/useEditMessage'

export default function MessageInfo({isVisible,msg}){
  const [loading,setLoading] = useState(false)
  const {selectedConversation,setMessages} = useConversation()  
  const {reply,setReply,setReplyOf} = useReply()
  const {setEditMessage,editMessage,edit,setEdit,setEditMessageId} = useEditMessage()
  const handleDelete = async () => {
    try{
      setLoading(true)
      const response = await fetch(`
        /api/delete-message?messageId=${msg._id}&receiverId=${selectedConversation.user_id}
        `,{
        method:'DELETE',
        headers:{
          'Content-type':'application/json'
        }
      })
      const data = await response.json()
      setMessages(data.messages)
      setLoading(false)
    }catch(e){
      console.log(e)
    }
  }

  const handleEdit = async (message) => {
    setEdit(true)
    setEditMessage(message.message)
    setEditMessageId(message._id)
  }

  if(loading){
    return (
      <div className={`right-[100%] bottom-0 flex shadow-sm flex-col border bg-white dark:bg-slate-800 rounded-md border-gray-200 dark:border-slate-700 w-24 h-[124px]
        justify-center items-center z-50
        ${isVisible?`absolute`:`hidden`}
      `}>
        <Loader2 className="animate-spin text-cyan-600" />
        </div>
    )
  }
  return <div className={`right-[100%] bottom-0 flex shadow-sm flex-col border bg-white dark:bg-slate-800 rounded-md border-gray-200 dark:border-slate-700 w-24
    ${isVisible?`absolute z-50`:`hidden`}
  `}>
    <div className="p-2 hover:bg-gray-200 dark:hover:bg-slate-900 cursor-pointer      hover:rounded-t-md border-b border-gray-200 dark:border-slate-700"
    onClick={()=>{setReply(true);setReplyOf(msg)}}>
      Reply
    </div>

    <div className="p-2 hover:bg-gray-200 dark:hover:bg-slate-900 cursor-pointer
    border-b border-gray-200 dark:border-slate-700"
    onClick={()=>{handleEdit(msg)}}
    >Edit
    </div>

    <div className="dark:hover:bg-slate-900 dark:border-slate-700 p-2 hover:bg-gray-200 cursor-pointer hover:rounded-b-md"
      onClick={async () => {
        await handleDelete()
      }}
    >
      Delete
    </div>    
    
  </div>
  
}