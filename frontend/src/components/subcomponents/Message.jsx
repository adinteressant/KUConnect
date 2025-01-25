import useConversation from '../../zustand/useConversation'
import MessageInfo from './MessageInfo'

import { getHours,getMinutes } from '../../utils/timeConversion'
import { useState, useEffect, useRef } from 'react'
import { MoreHorizontal } from 'lucide-react'

export default function Message({message}) {
  //logged in user

  const [timeDisplay,setTimeDisplay] = useState(false)
  const [showMessageInfo,setShowMessageInfo] = useState(false)
  const [isBottomMessage, setIsBottomMessage] = useState(false)
  const messageRef = useRef(null)

  useEffect(() => {
    if (messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect()
      const container = messageRef.current.closest('.overflow-y-auto')
      const containerRect = container.getBoundingClientRect()
      const distanceFromBottom = containerRect.bottom - rect.bottom
      setIsBottomMessage(distanceFromBottom < 100) // If message is within 100px of bottom
    }
  }, [showMessageInfo])

  const authUserId = JSON.parse(localStorage.getItem('authUser'))
  const {selectedConversation} = useConversation()
  const fromMe = message.senderId == authUserId
  const positionClass = fromMe ? 'items-end justify-end' : 'items-start justify-start'
  const colorClass = fromMe ? `${!timeDisplay?`bg-cyan-500`:`bg-cyan-600`} text-white`:`${!timeDisplay?`bg-gray-200 dark:bg-slate-600 dark:text-slate-200`:`dark:bg-slate-500 dark:text-slate-200 bg-gray-300`} text-gray-900`
  

  const displayTime = () => {
    setTimeDisplay(timeDisplay => !timeDisplay)
  }
  const displayMessageInfo = () => {
    setShowMessageInfo(showMessageInfo => !showMessageInfo)
  }
  const removeMessageInfo = () => {
    setShowMessageInfo(false)
  }

  return (
    <div className={`w-full flex ${positionClass} space-x-4 items-center group`}>
      {!fromMe &&
        (
        <div>
          <img className="w-10 h-10 rounded-full"
          src={`/api/get-pfp?id=${selectedConversation.pfp_id}`} alt=""/>
        </div>
        )
      }
      {
        fromMe &&
        (
          <div className="flex flex-col items-end relative"
          ref={messageRef}
          onMouseLeave={removeMessageInfo}>
            <MessageInfo isVisible={showMessageInfo} id={message._id} isBottomMessage={isBottomMessage}/>
            <div className={`p-1 hidden affected-class group-hover:block cursor-pointer
              hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full`}
              onClick={displayMessageInfo}  
            >
              <svg width="18" height="18" viewBox="0 0 24 24" 
                className = 'stroke-1 stroke-gray-600 dark:stroke-slate-200'>
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </div>
          </div>
        )
      }
      <div className="flex flex-col items-end max-w-[60%]">
        <div className={`${colorClass} p-3 rounded-lg cursor-pointer break-all
          ${fromMe && `hovered-class`}
        `}
          onClick={displayTime}
        >
          {message.message}
        </div>
        <div className={`text-[0.6rem] text-gray-500 transition-all duration-150 ease-in-out
            ${!timeDisplay ? `opacity-0 invisible max-h-0 overflow-hidden` : `opacity-100 visible`}`}>
          {getHours(message.createdAt)} : {getMinutes(message.createdAt)}
        </div>
      </div>

    </div>
  )
}