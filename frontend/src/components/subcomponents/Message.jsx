import useConversation from '../../zustand/useConversation'

import { getHours,getMinutes } from '../../utils/timeConversion'
import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

export default function Message({message}) {
  //logged in user

  const [timeDisplay,setTimeDisplay] = useState(false)

  const authUserId = JSON.parse(localStorage.getItem('authUser'))
  const {selectedConversation} = useConversation() //needed for further customization
  const fromMe = message.senderId == authUserId
  const positionClass = fromMe ? 'items-end justify-end' : 'items-start justify-start'
  const colorClass = fromMe ? `${!timeDisplay?`bg-cyan-500`:`bg-cyan-600`} text-white`:`${!timeDisplay?`bg-gray-200`:`bg-gray-300`} text-gray-900`
  

  const displayTime = () => {
    setTimeDisplay(timeDisplay => !timeDisplay)
  }

  return <div className="overflow-auto scrollbar-custom">
    <div className="flex flex-col w-full "> 
      
      <div className={`flex ${positionClass} space-x-4 items-center`}>
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
            <div className={`${!timeDisplay?`hidden`:``} cursor-pointer
              hover:bg-gray-300 rounded-full`}
              onClick={()=>{console.log('three dots')}}  
            >
              <MoreHorizontal color="gray"/>
            </div>
          )
        }
        <div className="flex flex-col items-end">
          <div className={`${colorClass} p-3 rounded-lg max-w-xs cursor-pointer`}
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
      </div>
    </div>
 }