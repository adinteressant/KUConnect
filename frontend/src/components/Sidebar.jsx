import { 
  Home as HomeIcon, 
  MessageCircle as MessagesIcon, 
  Users as FriendsIcon, 
  Bell ,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRequestCount } from '../zustand/useRequestCount';

export default function Sidebar() {
  const [userProfile, setUserProfile] = useState({});
  const { unviewedRequestCount, setUnviewedRequestCount, viewedRequestCount } = useRequestCount();

  // Fetch user profile and incoming request count on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Get user profile data
        const profileResponse = await axios.get('/api/get-user-profile/');
        setUserProfile(profileResponse.data);

        // Fetch incoming requests
        const incomingRequestsResponse = await axios.get('/api/view-incoming-requests?user_id=' + profileResponse.data.user_id);
        setUnviewedRequestCount(incomingRequestsResponse.data.incoming.length-viewedRequestCount); // Update the request count in Zustand state

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

    // Poll every 10 seconds to keep the data updated
    const intervalId = setInterval(fetchData, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [setUnviewedRequestCount]);

  return (
    <div className="w-64 bg-white shadow-md p-4 fixed z-10 bottom-0 top-14">
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink to="/" className={({ isActive }) => 
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <HomeIcon className="mr-3 text-cyan-600" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/messages" className={({ isActive }) =>
              `${isActive ? 'bg-gray-200' : 'bg-white'}
              flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer transition-all`
            }>
              <MessagesIcon className="mr-3 text-cyan-600" />
              <span>Messages</span>  
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
                  {unviewedRequestCount > 0 && (
                    <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unviewedRequestCount}
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
                  {userProfile.unread_count > 0 && (
                    <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {userProfile.unread_count}
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