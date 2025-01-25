import { useState } from 'react'
import useConversation from '../../zustand/useConversation'
import { Loader2 } from 'lucide-react'

export default function MessageInfo({isVisible,id}){
  const [loading,setLoading] = useState(false)
  const {selectedConversation,setMessages} = useConversation()  
  const handleDelete = async () => {
    try{
      setLoading(true)
      const response = await fetch(`
        /api/delete-message?messageId=${id}&receiverId=${selectedConversation.user_id}
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
  if(loading){
    return (
      <div className={`mr-[26px] flex shadow-sm flex-col border bg-white dark:bg-slate-800 rounded-md border-gray-200 dark:border-slate-700 h-20 w-24
        justify-center items-center
        ${isVisible?`absolute z-50`:`hidden`}
      `}>
        <div>
        <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        </div>
    )
  }
  return <div className={`mr-[100%] bottom-0 flex shadow-sm flex-col border bg-white dark:bg-slate-800 rounded-md border-gray-200 dark:border-slate-700
    ${isVisible?`absolute`:`hidden`}
  `}>
    <div className="border-b dark:hover:bg-slate-900 border-gray-200 dark:border-slate-700 p-2 hover:bg-gray-200 cursor-pointer hover:rounded-t-md"
      onClick={async () => {
        await handleDelete()
      }}
    >
      Delete
    </div>
    <div className="p-2 hover:bg-gray-200 dark:hover:bg-slate-900 cursor-pointer hover:rounded-b-md">operation2</div>
  </div>
}