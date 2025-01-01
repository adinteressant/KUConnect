import { HomeIcon, MessagesSquareIcon as MessagesIcon, GroupIcon as FriendsIcon, CalendarIcon as NotificationsIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import 
export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md p-4 fixed z-10 bottom-0 top-14">
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink to="/" className={({isActive})=> 
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <HomeIcon className="mr-3 text-cyan-600" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/messages" className={({isActive})=>
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <MessagesIcon className="mr-3 text-cyan-600" />
              <span>Messages</span>  
            </NavLink>
          </li>
          <li>
            <NavLink to="/friends" className={({isActive})=>
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <FriendsIcon className="mr-3 text-cyan-600" />
              <span>Friends</span>  
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications" className={({isActive})=>
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <div className="relative">
                <NotificationsIcon className="mr-3 text-cyan-600" />
                <div className="absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                 
                </div>
              </div>
              <span>Notifications</span>  
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

