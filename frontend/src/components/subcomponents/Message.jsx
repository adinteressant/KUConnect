import MessageInfo from './MessageInfo'
import SpecificPost from './SpecificPost'

import { getHours, getMinutes } from '../../utils/timeConversion'
import { useEffect, useState } from 'react'
import { Reply } from 'lucide-react'

import useReply from '../../zustand/useReply'
import useConversation from '../../zustand/useConversation'
import {useGetUpdateCallId} from '../hooks/useUpdateCallId'
import { Link } from 'react-router-dom'

export default function Message({ message, replyMessage, mm, dd, prevMM,prevDD,senderName='',senderNameId='' }) {
  //logged in user

  const [timeDisplay, setTimeDisplay] = useState(false)
  const [showMessageInfo, setShowMessageInfo] = useState(false)

  const authUserId = JSON.parse(localStorage.getItem('authUser'))
  const { selectedConversation } = useConversation()
  const fromMe = message.senderId == authUserId
  const positionClass = fromMe ? 'items-end justify-end' : 'items-start justify-start'
  const colorClass = fromMe ? `${!timeDisplay ? `bg-cyan-500` : `bg-cyan-600`} text-white` : `${!timeDisplay ? `bg-gray-200 dark:bg-slate-600 dark:text-slate-200` : `dark:bg-slate-500 dark:text-slate-200 bg-gray-300`} text-gray-900`

  const { setReplyOf, setReply } = useReply()

  const displayTime = () => {
    setTimeDisplay(timeDisplay => !timeDisplay)
  }
  const displayMessageInfo = () => {
    setShowMessageInfo(showMessageInfo => !showMessageInfo)
  }
  const removeMessageInfo = () => {
    setShowMessageInfo(false)
  }
  const handleCallJoin =async  () => {
   const data = await useGetUpdateCallId(senderNameId,authUserId)
   if (data.message=='found'){
    console.log(data.callId)
   }else{
    console.log(data.message)
   }
  }
  return (<div>
    {(dd!=prevDD || mm!=prevMM) &&
    (<div className="text-[.75rem] text-gray-500 w-full flex justify-center">
      <div>
      {mm}&nbsp;{dd}
      </div>
    </div>
    )
    }
    <div className={`w-full flex ${positionClass} space-x-4 items-center group`}>
      {!fromMe &&
        (
          <div>
            <img className="w-10 h-10 rounded-full"
              src={`/api/get-pfp?id=${selectedConversation.pfp_id}`} alt="" />
          </div>
        )
      }
      <div className={`flex flex-col ${!fromMe ? 'items-start' : 'items-end'}  max-w-[60%]`}>
        {replyMessage && (
          <div className="dark:bg-slate-800 p-2 rounded-md flex items-center gap-2 pr-3
          bg-gray-100 text-gray-800 dark:text-gray-200">
            <Reply />
            <div>
              {replyMessage.message || 
              <div className='border border-gray-400 rounded-lg'>
                <SpecificPost msgPostId={replyMessage.postId}/>
              </div>}
            </div>
          </div>
        )}
          <div className="flex items-center gap-2">
            {
              fromMe &&
              (
                <div className="flex flex-col items-end relative"
                  onMouseLeave={removeMessageInfo}>
                  <div className={`p-1 opacity-0 affected-class group-hover:opacity-100 cursor-pointer
                    hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full`}
                    onClick={displayMessageInfo}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24"
                      className='stroke-1 stroke-gray-600 dark:stroke-slate-200'>
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </div>
                  <MessageInfo isVisible={showMessageInfo} msg={message} post={message.postId}/>
                </div>
              )
            }
            <div className="flex flex-col items-end">
              
              {message.postId?
                <Link className='rounded-lg shadow-md bg-sky-200 hover:bg-sky-100 dark:bg-sky-800 dark:hover:bg-sky-900' to={`/post/${message.postId}`}>
                  <SpecificPost msgPostId={message.postId} />
                </Link>
                :message.callId?
                <div className={`${colorClass} p-3 rounded-lg ${fromMe && `hovered-class`}`}>
                  {!fromMe &&
                  <div>
                  <div>{senderName} started a call.</div>
                   <button className="py-1 px-3 rounded-3xl bg-green-400 dark:bg-green-600
                   hover:bg-green-500 dark:hover:bg-green-700"
                   onClick={handleCallJoin}>Join</button>
                  </div>
                  }
                  {fromMe && 
                    <div>You started video call</div>
                  }
                </div>
                : 
                <div className={`${colorClass} p-3 rounded-lg cursor-pointer break-all
                    ${fromMe && `hovered-class`}
                  `}
                  onClick={displayTime}
                >
                  {message.message}
                </div>}
              <div className={`flex justify-between w-full px-2
                ${!timeDisplay ? `opacity-0 invisible max-h-0 overflow-hidden` : `opacity-100 visible`}`}>
                <div className={`text-[0.6rem] text-gray-500 transition-all duration-150 ease-in-out`}>
                  {message.edited ? 'Edited' : ''}
                </div>
                <div className={`text-[0.6rem] text-gray-500 transition-all duration-150 ease-in-out`}>
                  {getHours(message.updatedAt)} : {getMinutes(message.updatedAt)}
                </div>
              </div>
            </div>
            {!fromMe &&
              (<div className="p-1 hidden group-hover:block cursor-pointer
              hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                onClick={() => { setReply(true); setReplyOf(message) }}>
                <Reply className="dark:text-slate-200 text-gray-600" />
              </div>)
            }
          </div>
      </div>

    </div>
  </div>
  )
}
