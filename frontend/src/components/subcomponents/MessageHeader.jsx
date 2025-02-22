import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import {useSocketContext} from '../context/socketContext.jsx';
import useSendMessage from '../hooks/useSendMessage.js'

export default function MessageHeader({ username }) {
  const [profileData, setProfileData] = useState({
    pfp_id: null,
    role: '',
    user_id: '',
  });
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const {socket,onlineUsers} = useSocketContext();
  const {sendMessage} = useSendMessage()
  // Fetch profile data based on username
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Fetch user profile data 
        const response = await fetch(`/api/get-profile?username=${username}`);
        if (!response.ok) {
          throw new Error('Error fetching profile data');
        }

        const data = await response.json();
        setProfileData(data);
        setError(false);

        // // Fetch profile picture if pfp_id is available
        // if (data.pfp_id) {
        //   setProfilePic(`/api/get-pfp?id=${data.pfp_id}`);
        // } else {
        //   setProfilePic(null); // No profile picture available
        // }
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [username]);

  // Fetch user profile (this is more specific to the user)
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await fetch('/api/get-user-profile/', {
          credentials: 'same-origin',
        });
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  const onCallHandler = ()=>{
    window.open(`/call?start_call=true&&userId=${profileData.user_id}`, "_blank")
    sendMessage(null,null,null,'callId')
  }
 
  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800 dark:bg-slate-900 sticky">
      <div className="flex items-center gap-3">
      {loading ? (
  <div className="w-10 h-10 rounded-full dark:bg-slate-900 bg-gray-200 animate-pulse" />
) : profileData.pfp_id && !error ? (
  <img
    src={`/api/get-pfp?id=${profileData.pfp_id}`}
    alt={`${username}'s profile`}
    className="w-10 h-10 rounded-full object-cover border border-gray-200"
    onError={() => {
      setError(true);
    }}
  />
) : (
  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
    <span className="text-indigo-600 font-medium">
      {username?.charAt(0)?.toUpperCase() || '?'}
    </span>
  </div>
)}

        <div className="font-medium text-gray-900">
        <Link 
                    to={`/${username}`}
                    className="font-medium dark:text-slate-100"
                  >{username}
                  </Link>
                  </div>
    {(onlineUsers.includes(profileData.user_id))?
        <div className='dark:text-gray-200 bg-gray-200 dark:bg-slate-700 rounded-full flex justify-center items-center p-2'>
          <button onClick={onCallHandler}><PhoneCall className='h-5 w-5'/>
          </button>
        </div>
      :
      <div>
      </div>
    }
      </div>
    
  </div>
  );
}
