import MessageHeader from './MessageHeader.jsx'
import Messages from './Messages.jsx'
import SendMessage from './SendMessage.jsx'
export default function MessageContainer(){

  return <div className="p-4 ml-64">
  <MessageHeader/>
  <Messages/>
  <SendMessage/>
  </div>
}