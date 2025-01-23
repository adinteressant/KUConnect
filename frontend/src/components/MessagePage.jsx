import { Link } from 'react-router-dom'
import MessageContainer from './subcomponents/MessageContainer.jsx'
import MessageSidebar from './subcomponents/MessageSidebar.jsx'

export default function MessagePage(){
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if(!isAuthenticated){
    return (<div className="m-4 bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md">
      Please <Link to="/login" className="text-cyan-600">log in</Link> to message.
    </div>)
  }
  return <div className="h-[100%] flex">
    <MessageSidebar/>
    <MessageContainer/>
  </div>
}
