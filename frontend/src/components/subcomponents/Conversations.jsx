import { useMemo } from 'react'
import useConversation from '../../zustand/useConversation'
import { useGetUnreadMessage } from '../hooks/useGetUnreadMessage'
import useNewMessages from '../../zustand/useNewMessages'

export default function Conversations({ conversations, loading }) {
  const { selectedConversation, setSelectedConversation } = useConversation()
  useGetUnreadMessage()
  const {newMessages,setNewMessages} = useNewMessages()

  // Memoize the count calculation for better performance
    const enhancedConversations = useMemo(() => {
      return conversations.map((conversation) => {
        let count = newMessages.filter(
          (unreadMessage) => unreadMessage.senderId === conversation.user_id
        ).length;
  
        if (selectedConversation?.user_id === conversation.user_id) count = 0
  
        return { ...conversation, count }
      })
    }, [conversations, newMessages, selectedConversation])
  
    const changeMessageStatus = (id) => {
      fetch(`/api/change-message-status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  

  return (
    <div className="flex flex-col gap-4 mt-5">
      {loading ? (
        <div>Loading...</div>
      ) : (
        enhancedConversations.map((conversation, index) => (
          <div
            key={index}
            className={`hover:bg-gray-200 cursor-pointer rounded-md flex justify-between px-3 ${
              selectedConversation?.user_id === conversation.user_id
                ? `bg-gray-200`
                : ``
            }`}
            onClick={() => {
              setSelectedConversation(conversation)
              changeMessageStatus(conversation.user_id)
              setNewMessages([])
            }}
          >
        <div className="flex items-center gap-3 p-2">
            <div>
           <img src = "images/light.svg" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
           </div>
           <div>
            {conversation.username}</div>
            </div>
            {conversation.count !== 0 && (
              <div className="px-1 rounded-full text-white bg-red-600">
                {conversation.count}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
