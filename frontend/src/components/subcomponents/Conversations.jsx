import useConversation from '../../zustand/useConversation'
import { useGetConversations } from '../hooks/useGetConversations'

export default function Conversations(){

  const  {loading,conversations} = useGetConversations()
  const {selectedConversation,setSelectedConversation} = useConversation()

  return <div className="flex flex-col gap-4 mt-5">

    {
      loading?
        <div>Loading...</div>
      :
      conversations.map((conversation,index)=>(
        <div key={index} className={`hover:bg-slate-500 cursor-pointer
        ${ selectedConversation?._id === conversation._id ? `bg-slate-500` :``}
        `}
        onClick={()=>{
            setSelectedConversation(conversation)
        }}
        >
            {conversation.username}
        </div>
      ))
    }
  </div>
}