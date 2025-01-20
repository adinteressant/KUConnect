import useConversation from "../../zustand/useConversation"

export default function MessageInfo({isVisible,id}){
  const {selectedConversation,setMessages} = useConversation()  
  const handleDelete = async () => {
    try{
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
    }catch(e){
      console.log(e)
    }
  }
  return <div className={`mr-[26px] flex shadow-sm flex-col border bg-white dark:bg-slate-800 rounded-md border-gray-200 dark:border-slate-700
    ${isVisible?`absolute z-50`:`hidden`}
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