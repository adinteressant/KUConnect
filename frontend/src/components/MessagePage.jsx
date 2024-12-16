import MessageContainer from './subcomponents/MessageContainer.jsx'
import MessageSidebar from './subcomponents/messageSidebar.jsx'

export default function MessagePage(){
  return <div className="flex flex-row">
    <MessageSidebar/>
    <MessageContainer/>
  </div>
}