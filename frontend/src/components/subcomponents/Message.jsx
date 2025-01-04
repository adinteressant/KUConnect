import useConversation from '../../zustand/useConversation'

export default function Message({message}) {
  //logged in user
  const authUserId = JSON.parse(localStorage.getItem('authUser'))
  const {selectedConversation} = useConversation() //needed for further customization
  const fromMe = message.senderId == authUserId
  const positionClass = fromMe ? 'items-end justify-end' : 'items-start justify-start'
  const colorClass = fromMe ? 'bg-cyan-500 text-white':'bg-gray-200 text-gray-900'
  return <div className="overflow-auto scrollbar-custom">
  <div className="flex flex-col space-y-4 w-full"> 
  
  <div className={`flex ${positionClass} space-x-4`}>
    <div className={`${colorClass} p-3 rounded-lg max-w-xs`}>
      {message.message}
    </div>
  </div>

  </div>
  </div>
 }