import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { sortArray } from "../../utils/sortArray"
import { useGetConversationsWithDate, useGetConversations } from "../hooks/useGetConversations"
import useGetFriends from "../hooks/useGetFriends"
import useSendMessage from "../hooks/useSendMessage"
import { Search } from 'lucide-react'

export default function SendToFriends({ closeShareOverlay, postId }) {

  const [loading, setLoadingState] = useState(true)
  const conversationsWithDate = useGetConversationsWithDate()
  const { conversations } = useGetConversations()
  const {sendMessage} = useSendMessage(null)

  let authUser
  if (localStorage.getItem('authUser') && localStorage.getItem('authUser') != 'undefined')
    authUser = JSON.parse(localStorage.getItem('authUser'))

  const userProfiles = useGetFriends(authUser)

  const friendList = useMemo(() => {
    const arr = conversations.map((conversation) => {
      let pfp_id
      let role
      userProfiles.forEach((userProfile) => {
        if (userProfile.user_id == conversation.user_id) {
          pfp_id = userProfile.pfp_id
          role = userProfile.role
          return
        }
      })

      let latestMessageDate = 0
      conversationsWithDate.forEach(conversationWithDate => {
        if ((conversation.user_id == conversationWithDate.givenParticipants[0]
          && authUser == conversationWithDate.givenParticipants[1])
          ||
          (conversation.user_id == conversationWithDate.givenParticipants[1]
            && authUser == conversationWithDate.givenParticipants[0])
        ) {
          if (conversationWithDate.latestMessageDate) {
            latestMessageDate = conversationWithDate.latestMessageDate
          }
          return
        }
      })

      return { ...conversation, pfp_id, role, latestMessageDate }
    })

    if (conversations.length && userProfiles.length) {
      setLoadingState(() => false)
    }

    return arr
  }, [conversations, userProfiles])

  sortArray(friendList)

  const sendMessageFunc = (receiverId) => {
    sendMessage(null, postId, receiverId)
    console.log(postId, receiverId)
    
  }

  return (
    <div className='flex flex-col w-[100%] h-[100%]'>
      {loading ?
        (<div className='flex flex-col w-[100%] dark:bg-slate-800 h-[100%]'>
          <div className='p-2 flex gap-2 border-b dark:border-slate-700'>
            {[1, 2, 3].map((_, index) => (
              <button key={index} className={`pl-7 pr-7 pt-4 pb-4 rounded-2xl bg-gray-200 dark:bg-slate-900 animate-pulse`}>
              </button>
            ))}
          </div>
          <div className='p-2 overflow-hidden flex flex-col gap-6 w-[100%] h-[100%]'>
            {[1, 2, 3, 4].map((_, index) => (<div key={index} className='flex'>
              <div className='mt-2 shrink-0 w-8 h-8 rounded-full object-cover dark:bg-slate-900 bg-gray-200 animate-pulse'>
              </div>
              <div className='ml-2 bg-gray-200 dark:bg-slate-900 w-[40%] h-[120%] rounded-xl animate-pulse object-cover'>
              </div>
            </div>))}
          </div>
        </div>)
        :
        (<div className='flex flex-col w-[100%] h-[100%]'>
          <div className='p-2 flex items-center gap-2 border-b dark:border-slate-700'>
            <div className='p-1 relative flex-1'>
              <input
                type="text"
                placeholder="Search conversations..."
                // onChange={handleChange}
                className="w-full px-4 py-2 pr-10 text-sm rounded-lg border dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 border-gray-200  dark:focus:ring-slate-700 focus:border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all placeholder:text-gray-400"
              />
              <label
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md "
              >
                <Search size={18} className="text-cyan-600" />
              </label>
            </div>
            <button onClick={closeShareOverlay} className=' p-2 rounded-full dark:hover:bg-gray-700 hover:bg-gray-200 transition-all duration-300'>
              <svg width='24' height='24' viewBox='0 0 24 24'
                className='stroke-gray-600 dark:stroke-white fill-none'
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className='p-2 overflow-y-auto scrollbar flex flex-col gap-2 w-[100%] h-[100%]'>
            {friendList.map((friend, index) =>
              <div key={index} className='flex items-center'>
                <Link className='mt-2 shrink-0' to={`/${friend.username}`}>
                  <img src={`/api/get-pfp?id=${friend.pfp_id}`} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                </Link>
                <div className='ml-2'>
                  <Link to={`/${friend.username}`} className='text-gray-800  dark:text-slate-200 font-semibold text-sm'>
                    {friend.username}
                  </Link>
                  <div className='text-gray-600 dark:text-gray-400 text-xs'>
                    {friend.role.charAt(0).toUpperCase() + friend.role.slice(1)}
                  </div>
                </div>
                <button className='ml-auto' onClick={() => sendMessageFunc(friend.user_id)}>
                  Send
                </button>
              </div>
            )}
            {friendList.length===0 && <div className="leading-none m-auto dark:text-gray-400 text-gray-600">No friends</div>}
          </div>
        </div>)}
    </div>
  )
}