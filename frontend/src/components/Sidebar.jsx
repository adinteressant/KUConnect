import { 
  Home as HomeIcon, 
  MessageCircle as MessagesIcon, 
  Users as FriendsIcon, 
  Bell ,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import useRequestCount from '../zustand/useRequestCount';
import useNewMessages from '../zustand/useNewMessages'


export default function Sidebar({userProfile,setUserProfile}) {
  const [userUnreadCount, setUserUnreadCount] = useState(userProfile.unread_count);
  const {incomingRequestsCount, setIncomingRequestsCount} = useRequestCount(); 
  const {newMessages} = useNewMessages()
  console.log(newMessages.length)
     //Fetch user profile
    useEffect(() => {
      async function fetchProfile ()  {
        try {
          const response = await axios.get('/api/get-user-profile/', {
            withCredentials: true,
          });
          if (response.data) {
            setUserProfile(response.data);
            setUserUnreadCount(userProfile.unread_count);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }fetchProfile();
    }, [userProfile.unread_count]);
  
    useEffect(() => {
      const fetchIncomingRequestsCount = async () => {
        const user_id = userProfile.user_id;
        if (!user_id) return; 
        try {
          const response = await axios.get(`/api/view-incoming-requests?user_id=${user_id}`, {
            withCredentials: true,
          });
          if (response.data) {
            setIncomingRequestsCount(response.data.incoming.length || 0);
          }
        } catch (error) {
          console.error('Error fetching incoming requests count:', error);
        }
      };
  
      fetchIncomingRequestsCount();
    }, [userProfile.user_id, setIncomingRequestsCount]);

  //useEffect(()=>{
  //  setUserUnreadCount(userProfile.unread_count);
  //},[]);


  return (
    <div className="w-64 bg-white shadow-md p-4 fixed z-10 bottom-0 top-14">
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink to="/" className={({ isActive }) => 
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5">
                  <HomeIcon className="mr-3 text-cyan-600 h-5 w-5" />
                </div>
                <span>Home</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/messages" className={({ isActive }) =>
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <div className="flex gap-2 items-center">
                <div className="relative h-5 w-5">
                    { newMessages.length!==0 &&
                    (
                    <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                        {newMessages.length}
                    </div>
                    )
                    }
                  <MessagesIcon className="mr-3 text-muted-foreground text-cyan-600 h-5 w-5" />
                </div>
                <span>Messages</span>
              </div>  
            </NavLink>
          </li>
          <li>
            <NavLink to="/friends" className={({ isActive }) =>
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FriendsIcon className="h-5 w-5 text-muted-foreground text-cyan-600" />
                  {incomingRequestsCount > 0 && (
                    <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {incomingRequestsCount}
                    </div>
                  )}
                </div>
                <span>Friends</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications" className={({ isActive }) =>
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground text-cyan-600" />
                  {userUnreadCount> 0 && (
                    <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {userUnreadCount}
                    </div>
                  )}
                </div>
                <span className="text-base text-foreground">Notifications</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
