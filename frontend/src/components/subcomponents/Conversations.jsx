import useConversation from '../../zustand/useConversation'
import { useGetUnreadMessage } from '../hooks/useGetUnreadMessage'

export default function Conversations({conversations,loading}){
  const {selectedConversation,setSelectedConversation} = useConversation()
  const unreadMessages = useGetUnreadMessage()
  
  const changeMessageStatus = (id) => {
    fetch(`/api/change-message-status/${id}`,{
      method:'PATCH',
      headers:{
        'Content-Type':'application/json',
      }
    })
    .then(response => response.json())
    .then(data =>{
      console.log(data)
    })
    .catch((e) => {
      console.log(e)
    })
  }

  return <div className="flex flex-col gap-4 mt-5">

    {
      loading?
        <div>Loading...</div>
      :
      conversations.map((conversation,index)=>{
        let count = 0
          unreadMessages.forEach(unreadMessage => {
            if(unreadMessage.senderId == conversation._id)  count++ 
          })
          if(selectedConversation?._id === conversation._id) count=0
        return (
        <div key={index} className={`hover:bg-slate-500 cursor-pointer flex justify-between
          px-3
        ${ selectedConversation?._id === conversation._id ? `bg-slate-500` :``}
        `}
        onClick={()=>{
            setSelectedConversation(conversation)
            changeMessageStatus(conversation._id)
        }}
        >
            <div>{conversation.username}</div>
            {
              count!=0 && (
                <div className="px-1 rounded-full text-white bg-red-600">{count}</div>
              )
            }
            
        </div>
      )}
    )
    }
  </div>
}
