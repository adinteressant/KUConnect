import MessageContainer from './subcomponents/MessageContainer.jsx'
import MessageSidebar from './subcomponents/MessageSidebar.jsx'

export default function MessagePage(){
  return <div className="grid grid-cols-[264px,1fr]">
    <MessageSidebar/>
    <MessageContainer/>
  </div>
}
