import { useMemo } from 'react'
import useConversation from '../../zustand/useConversation'
import { useGetUnreadMessage } from '../hooks/useGetUnreadMessage'
import useNewMessages from '../../zustand/useNewMessages'
import useGetFriends from '../hooks/useGetFriends'
import { useSocketContext } from '../context/socketContext'

export default function Conversations({ conversations, loading }) {
  const { selectedConversation, setSelectedConversation } = useConversation()
  const {onlineUsers} = useSocketContext()

  useGetUnreadMessage()
  console.log(localStorage.getItem('authUser'))
  const userProfiles = useGetFriends(JSON.parse(localStorage.getItem('authUser')))
  // const userProfiles = useGetProfile()
  const {newMessages,setNewMessages} = useNewMessages()

  // Memoize the count calculation for better performance
    const enhancedConversations = useMemo(() => {
      return conversations.map((conversation) => {
        let pfp_id
        userProfiles.forEach((userProfile)=>{
          if(userProfile.user_id == conversation.user_id){
            pfp_id = userProfile.pfp_id
            return
          }
        })
        let count = newMessages.filter(
          (unreadMessage) => unreadMessage.senderId === conversation.user_id
        ).length;
  
        if (selectedConversation?.user_id === conversation.user_id) count = 0
  
        return { ...conversation, count,pfp_id }
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
    <div className="flex flex-col mt-5">
      {loading ? (
        <div>Loading...</div>
      ) : (
        enhancedConversations.map((conversation, index) =>
          (
          <div
            key={index}
            className={`hover:bg-gray-200 dark:hover:bg-gray-700 mb-2 dark:text-slate-100 cursor-pointer hover:rounded-md flex justify-between
               px-3 border-gray-200 border-b text-gray-800
               ${selectedConversation?.user_id === conversation.user_id
                ? `bg-gray-200 dark:bg-gray-700 rounded-md`
                : ``}
                ${conversation.count ? `font-semibold`: ``}
                `
              }
            onClick={() => {
              setSelectedConversation(conversation)
              changeMessageStatus(conversation.user_id)
              if(conversation.count) setNewMessages([])
            }}
          >
        <div className="flex items-center gap-4 p-2 w-full ">
            <div className="relative">
              {onlineUsers?.includes(conversation.user_id) &&
              (
                <div className="bg-green-500 h-3 w-3 rounded-full absolute right-0"></div>
              )}
              
            <img src={`/api/get-pfp?id=${conversation.pfp_id}`}
            alt={`${conversation.username}'s profile`} className="rounded-full object-cover border border-gray-200 h-10 w-14" />
            </div>
            <div className="flex items-center justify-between w-full">
              <div>
                {conversation.username}
              </div>
              {conversation.count !== 0 && (
              <div className="px-1 h-5 w-5 rounded-full text-white bg-red-500 flex
              justify-center items-center
              ">
                <div className="text-sm font-normal">{conversation.count}</div>
                
              </div>
              )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
