import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { sortArray } from "../../utils/sortArray"
import { useGetConversationsWithDate, useGetConversations } from "../hooks/useGetConversations"
import useGetFriends from "../hooks/useGetFriends"
import useSendMessage from "../hooks/useSendMessage"
import { Loader2, Search } from 'lucide-react'

export default function SendToFriends({ closeShareOverlay, postId }) {

  const [friendList, setFriendList] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [loadingList, setLoadingListState] = useState(true)
  const conversationsWithDate = useGetConversationsWithDate()
  const { conversations } = useGetConversations()
  const { sendMessage } = useSendMessage(null)

  let authUser
  if (localStorage.getItem('authUser') && localStorage.getItem('authUser') != 'undefined')
    authUser = JSON.parse(localStorage.getItem('authUser'))

  const userProfiles = useGetFriends(authUser)

  useMemo(() => {
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

    sortArray(arr)

    setFriendList(() => arr.map(f => {return {...f, state: 'Send' }}))

    if(conversations.length && userProfiles.length) {
      setLoadingListState(() => false)
    }
  }, [conversations, userProfiles])

  const sendMessageFunc = async(friend) => {
    
    setFriendList(prev => 
      prev.map(f => 
        f.user_id===friend.user_id?
        {...f, state:'Sending'}
        :
        f
      )
    )
   
    await sendMessage(null, postId, friend.user_id) &&
    setFriendList(prev => 
      prev.map(f => 
        f.user_id===friend.user_id?
        {...f, state:'Sent'}
        :
        f
      )
    )
  }

  return (
    <div className='flex flex-col w-[100%] h-[100%]'>
      {loadingList ?
        (<div className='flex flex-col w-[100%] dark:bg-slate-800 h-[100%]'>
          <div className='p-2 flex border-b dark:border-slate-700'>
            <button className={`w-[80%] py-4 rounded-lg bg-gray-200 dark:bg-slate-900 animate-pulse`}>
            </button>
          </div>
          <div className='p-3 overflow-hidden flex flex-col gap-6 w-[100%] h-[100%]'>
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
                placeholder="Search friends..."
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full px-4 py-2 text-sm rounded-lg border dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 border-gray-200  dark:focus:ring-slate-700 focus:border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all placeholder:text-gray-400"
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
          <div className='p-3 overflow-y-auto scrollbar flex flex-col gap-2 w-[100%] h-[100%]'>
            {friendList
              .filter(friend => friend.username.toLowerCase().includes(searchValue.toLowerCase()))
              .map((friend, index) =>
              <div key={index} className='flex items-center pb-2 border-b border-gray-200 dark:border-slate-700'>
                <Link className=' shrink-0' to={`/${friend.username}`}>
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
                <button className='ml-auto px-4 py-2 rounded-full hover:shadow-lg text-sm text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900'
                  onClick={() => sendMessageFunc(friend)}
                  disabled={friend.state!=='Send'}
                >
                  {friend.state==='Sending'?
                  <Loader2 className='text-white animate-spin p-1'/>
                  :
                  friend.state
                  }
                </button>
              </div>
            )}
            {(friendList.length===0 || friendList.filter(friend => friend.username.toLowerCase().includes(searchValue.toLowerCase())).length===0) && <div className="leading-none m-auto dark:text-gray-400 text-gray-600">No friends</div>}
          </div>
        </div>)}
    </div>
  )
}