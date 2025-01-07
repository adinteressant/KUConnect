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
  return <div className={`mr-6 flex shadow-sm flex-col border bg-white rounded-md border-gray-200 
    ${isVisible?`absolute z-50`:`hidden`}
  `}>
    <div className="border-b border-gray-200 p-2 hover:bg-gray-200 cursor-pointer"
      onClick={async () => {
        await handleDelete()
      }}
    >
      Delete
    </div>
    <div className="p-2 hover:bg-gray-200 cursor-pointer">operation2</div>
  </div>
}