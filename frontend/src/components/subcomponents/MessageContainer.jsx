import { useEffect } from 'react'
import useConversation from '../../zustand/useConversation.js'
import MessageHeader from './MessageHeader.jsx'
import Messages from './Messages.jsx'
import NoChatSelected from './NoChatSelected.jsx'
import SendMessage from './SendMessage.jsx'
export default function MessageContainer(){
  const {selectedConversation} = useConversation()

  return <div className="p-4 ml-64">
  {
  !selectedConversation ? 
    (
      <NoChatSelected/>
    ) : 
    (
      <>
      <MessageHeader 
        username={selectedConversation.username} 
        userId={selectedConversation.userId} // Make sure this matches one of your image IDs (1-5)
      />      
      <Messages/>
      <SendMessage/>
      </>
    )  
  }
  </div>
}