import { 
  Home as HomeIcon, 
  MessageCircle as MessagesIcon, 
  Users as FriendsIcon, 
  Bell,
  Bookmark as SaveIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';

import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import useRequestCount from '../zustand/useRequestCount'
import useNewMessages from '../zustand/useNewMessages'

export default function Sidebar({userProfile,setUserProfile}) {
  const [userUnreadCount, setUserUnreadCount] = useState(userProfile.unread_count)
  const [isHovered, setIsHovered] = useState(false);
  const {incomingRequestsCount, setIncomingRequestsCount} = useRequestCount() 
  const {newMessages} = useNewMessages()
  const uniqueSendersCount = new Set(newMessages.map(msg => msg.senderId)).size;
  
  // const [selected, setSelected] = useState(localStorage.getItem('darkmode') || "light");
//   const {theme, toggleTheme} = useTheme();
// useEffect(() => {
//   if (theme === 'dark') {
//     document.documentElement.classList.add('dark');
//   } else {
//     document.documentElement.classList.remove('dark');
//   }
// }, [theme]);

     //Fetch user profile
    useEffect(() => {
      async function fetchProfile ()  {
        try {
          const response = await axios.get('/api/get-user-profile/', {
            withCredentials: true,
          })
          if (response.data) {
            setUserProfile(response.data)
            setUserUnreadCount(userProfile.unread_count)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      }fetchProfile()
    }, [userProfile.unread_count])

  
    useEffect(() => {
      const fetchIncomingRequestsCount = async () => {
        const user_id = userProfile.user_id
        if (!user_id) return 
        try {
          const response = await axios.get(`/api/view-incoming-requests?user_id=${user_id}`, {
            withCredentials: true,
          })
          if (response.data) {
            setIncomingRequestsCount(response.data.incoming.length || 0)
          }
        } catch (error) {
          console.error('Error fetching incoming requests count:', error)
        }
      }
  
      fetchIncomingRequestsCount()
    }, [userProfile.user_id, setIncomingRequestsCount])

  //useEffect(()=>{
  //  setUserUnreadCount(userProfile.unread_count)
  //},[])

  
    return (
   <div className="grid place-content-center transition-colors bg-white text-black dark:bg-slate-800 dark:text-white">
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 220 : 60 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20 
        }}
        className="shadow-md p-2 fixed z-10 bottom-0 top-16 h-screen border-r dark:border-slate-800 border-gray-200 transition-colors bg-white dark:bg-slate-800"
      >
        <nav>
          <ul className={`space-y-2 ${isHovered ? 'justify-start': 'place-items-center'}`}>
            {[
              { 
                to: "/home", 
                icon: <HomeIcon className="text-cyan-600 h-5 w-5" />, 
                label: "Home" 
              },
              { 
                to: "/messages", 
                icon: (
                  <div className="relative h-6 w-6 flex justify-center items-center">
                    {newMessages.length > 0 && (
                      <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                        {uniqueSendersCount}
                      </div>
                    )}
                    <MessagesIcon className="text-cyan-600 h-5 w-5" />
                  </div>
                ), 
                label: "Messages" 
              },
                { 
                  to: "/friends", 
                  icon: (
                    <div className="relative h-6 w-6 flex justify-center items-center">
                      <FriendsIcon className="text-cyan-600 h-5 w-5" />
                      {incomingRequestsCount > 0 && (
                        <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                          {incomingRequestsCount}
                        </div>
                      )}
                    </div>
                  ), 
                  label: "Friends" 
                },
                { 
                  to: "/notifications", 
                  icon: (
                    <div className="relative h-6 w-6 flex justify-center items-center">
                      <Bell className="text-cyan-600 h-5 w-5" />
                      {userUnreadCount > 0 && (
                        <>
                          <div className="absolute animate-ping -right-2 -top-2 flex h-5 w-5 rounded-full bg-red-500" />
                          <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            {userUnreadCount}
                          </div>
                        </>
                      )}
                    </div>
                  ), 
                  label: "Notifications" 
                },
                { 
                  to: "/posts/saved", 
                  icon: <SaveIcon className="text-cyan-600 h-5 w-5" />, 
                  label: "Saved Posts" 
                }
              ].map((item) => (
                <li key={item.to}>
                  <NavLink 
                    to={item.to} 
                    className={({ isActive }) => `
                      ${isActive
                        ? 'dark:text-white dark:hover:bg-gray-700 dark:bg-gray-700 dark:shadow-inner bg-gray-200 shadow-inner'
                        : 'hover:bg-gray-200'
                      }
                      flex items-center p-3 rounded-lg cursor-pointer transition-all dark:hover:bg-gray-700
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="truncate whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      </div>
    );
  }