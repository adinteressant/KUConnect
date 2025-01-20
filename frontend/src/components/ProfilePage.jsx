import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Posts from './subcomponents/Posts.jsx'
import useRequestCount from '../zustand/useRequestCount.js';

export default function ProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState({
    pfp_id: null,
    role: '',
    user_id: '',
  });
  const [userProfile, setUserProfile] = useState({});
  const [showUnfriendPopup, setShowUnfriendPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [status, setStatus] = useState('none')
  const [posts, setPosts] = useState([])
  const { incomingRequestsCount, setIncomingRequestsCount } = useRequestCount();
  const dropdownRef = useRef(null);

  const scrollContainerRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0,0)
  }, [location.pathname])

  useEffect(() => {
    // Fetch profile data
    fetch(`/api/get-profile?username=${username}`, {
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching profile: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setProfileData(data))
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });
  }, [username]);

  useEffect(() => {
    // Fetch user profile
    (async () => {
      try {
        const response = await axios.get('/api/get-user-profile/', {
          withCredentials: true,
        });
        if (response.data) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    })();
  }, []);

  useEffect(() => {
    if(profileData.user_id)
    {
      fetch(`/api/posts/user/${profileData.user_id}/get-user-posts`)
      .then((response) => response.json())
      .then(data => {
        setPosts(() => data.posts)
      })
      .catch(error =>
        console.error('Error fetching user posts:', error)
      )
    }
  }, [profileData])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const confirmRequest = () => {
    const receiver_id = userProfile.user_id;
    const sender_id = profileData.user_id; 
  
    fetch('/api/confirm-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender_id, receiver_id }),
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to accept request');
        return response.json();
      })
      .then(() => {
        setStatus('accepted');
        setIncomingRequestsCount(incomingRequestsCount-1);
        setIncomingRequests((prev) =>
          prev.filter((req) => req.sender_id !== sender_id)
        );
      })
      .catch((err) => console.error('Error accepting request:', err));
  };

    // Cancel sent request
    const cancelRequest = () => {
          const sender_id = userProfile.user_id;
    const receiver_id = profileData.user_id; 
      fetch('/api/cancel-sent-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender_id, receiver_id }),
        credentials: 'same-origin',
      })
        .then((response) => {
          setStatus('none');
          if (!response.ok) throw new Error('Failed to cancel request');
          return response.json();
        })
        .then(() => {
          setSentRequests((prev) => prev.filter((req) => req.request_id !== request_id));
        })
        .catch((err) => console.error('Error canceling request:', err))
    };
  
  const rejectRequest = () => {
    const receiver_id = userProfile.user_id;
    const sender_id = profileData.user_id;
  
    fetch('/api/reject-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender_id, receiver_id }),
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to deny request');
        return response.json();
      })
      .then(() => {
        setStatus('none');
        setIncomingRequestsCount(incomingRequestsCount-1);
        setIncomingRequests((prev) =>
          prev.filter((req) => req.sender_id !== sender_id)
        );
      })
      .catch((err) => console.error('Error denying request:', err));
  };
  
  const handleUnfriend = () => {
      const sender_id = userProfile.user_id;
      const receiver_id = profileData.user_id;
  
      fetch('/api/unfriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender_id, receiver_id }),
        credentials: 'same-origin',
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to unfriend');
          return response.json();
        })
        .then(() => {
          setStatus('none');
          setShowUnfriendPopup(false);
        })
        .catch((err) => console.error('Error unfriending:', err));
  };

  const checkRequestStatus = async (user1_id, user2_id) => {
    try {
      const response = await fetch(`/api/check-status?user1_id=${user1_id}&user2_id=${user2_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) throw new Error('Failed to check request status');
      const data = await response.json();
      return data.status; // 'pending', 'accepted', 'none', etc.
    } catch (error) {
      console.error('Error checking request status:', error);
      return 'error'; // Handle error case
    }
  };  

  useEffect(() => {
    // Check friend request status once both userProfile and profileData are loaded
    if (userProfile.user_id && profileData.user_id) {
      const fetchStatus = async () => {
        const requestStatus = await checkRequestStatus(userProfile.user_id, profileData.user_id);
        setStatus(requestStatus);
      };

      fetchStatus();
    }
  }, [userProfile, profileData]);   
  
  const handleAddFriend = () => {
    const receiver_id = profileData.user_id;
    const sender_id = userProfile.user_id;

    fetch('/api/add-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin', // Ensure cookies are sent for authentication
      body: JSON.stringify({ sender_id, receiver_id }),
    })
      .then((response) => {
        console.log('Sender ID:', userProfile.user_id);
        console.log('Receiver ID:', profileData.user_id);

        if (response.ok) {
          setStatus('pending');
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || 'Failed to send friend request');
          });
        }
      })
      .catch((error) => {
        console.error('Error sending friend request:', error);
      });
  };

  return (
    <div className={`flex-1 min-h-screen dark:bg-slate-900 dark:text-gray-200 bg-gray-100 text-gray-800 p-6 overflow-y-auto `} ref={scrollContainerRef}>
      <div className="max-w-2xl mx-auto border dark:border-slate-700 dark:bg-slate-800 space-y-4 p-8 rounded-lg shadow-md mb-4">
        {/* Profile picture with hover effect */}
        <div
          className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300}
                     flex items-center justify-center mx-auto
                     relative group cursor-pointer`}
        >
          {profileData.pfp_id ? (
            <img
              src={`/api/get-pfp?id=${profileData.pfp_id}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500">No Profile Picture</span>
          )}
        </div>

        {/* Rest of the profile content */}
        <div className="text-center mt-4 flex flex-col">
          <h1 className="text-3xl font-serif font-bold">
            {username}
          </h1>
          <h2 className="text-2xl font-serif font-semibold">Role: {profileData.role}</h2>

          {/* Add Friend button */}
          {userProfile.username === username?
            (
              <Link to={`/customizemyprofile`} className='mx-auto mt-6 bg-cyan-600 text-white rounded-full hover:shadow-lg hover:bg-cyan-700 transition-all duration-300 flex justify-center items-center gap-2 py-2 px-4'>
                  <svg width="24" height="24" viewBox="0 0 24 24" className='fill-none stroke-2 stroke-white'>
                    <path d="M2 21a8 8 0 0 1 10.821-7.487"/>
                    <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
                    <circle cx="10" cy="8" r="5"/>
                  </svg>
                  <div>
                    Customize Profile
                  </div>
              </Link>
            )
            :
            (status === 'none' ? (
              <div className = "flex items-center justify-center space-x-4">
              <button
                onClick={handleAddFriend}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
              >
                Add Friend
              </button>
              </div>
            ) : status === 'pending' ? (<>
              <p className="mt-6 text-green-600">Friend Request Sent!</p>
              <div className = "flex items-center justify-center space-x-4">
              <button
                  onClick={cancelRequest}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                </div>
                </>
            ) : 
            status === 'accepted' ? (
              <div className="flex items-center justify-center space-x-4">
                <div className="relative" ref = {dropdownRef}>
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="bg-cyan-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition"
                  >
                    Friends
                  </button>
                  {showDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-md shadow-lg z-10">
                      <button 
                        onClick={() => setShowUnfriendPopup(true)}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                      >
                        Unfriend
                      </button>
                    </div>
                  )}
                </div>
              
                  <Link to={`/messages?userId=${profileData.user_id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                  >
                    Message
                  </Link>
                
              </div>
            ) : status ==='incoming' ? (
                <>
                <p className="mt-6 text-green-600">User has sent you a friend request!</p><br />
                <div className="flex items-center justify-center mt-6 space-x-4">
                <button
                onClick={confirmRequest}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
              >
                Confirm Request
              </button>
              <button onClick={rejectRequest} 
              className='mt-6 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-700 transition'>
                Cancel Request
              </button>
              </div>
              </>
              ) : null)
          }
        </div>
      </div>

      {/* Displaying Posts */}
      <Posts posts={posts} setPosts={setPosts}/>

      {showUnfriendPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-lg font-semibold mb-4">Unfriend {username}</p>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove {username} as your friend?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUnfriendPopup(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUnfriend}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}