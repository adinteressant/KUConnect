import { 
  Home as HomeIcon, 
  MessageCircle as MessagesIcon, 
  Users as FriendsIcon, 
  Bell as NotificationsIcon, 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar(){
  return <div className="w-64 bg-white shadow-md p-4 fixed z-10 bottom-0 top-14">
    <nav>
      <ul className="space-y-2">
        <li>
          <NavLink to="/" className={({isActive})=> 
            `${isActive ? 'bg-gray-200' : 'bg-white'}
            flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all
            `}>
            <HomeIcon className="mr-3 text-cyan-600" />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/messages" className={({isActive})=>
             `${isActive ? 'bg-gray-200' : 'bg-white'}
            flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all
            `}>
          
            <MessagesIcon className="mr-3 text-cyan-600" />
            <span>Messages</span>  
          </NavLink>
        </li>
        <li>
          <NavLink to="/friends" className={({isActive})=>
             `${isActive ? 'bg-gray-200' : 'bg-white'}
            flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all
            `}>
          
            <FriendsIcon className="mr-3 text-cyan-600" />
            <span>Friends</span>  
          </NavLink>
        </li>
        <li>
          <NavLink to="/notifications" className={({isActive})=>
             `${isActive ? 'bg-gray-200' : 'bg-white'}
            flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all
            `}>
            <NotificationsIcon className="mr-3 text-cyan-600" />
            <span>Notifications</span>  
          </NavLink>
        </li>
      </ul>
    </nav>
  </div>
}