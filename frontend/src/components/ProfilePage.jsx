import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState({
    pfp_id: null,
    role: '',
    user_id: '',
  });
  const [userProfile, setUserProfile] = useState({});
    const [incomingRequests, setIncomingRequests] = useState([]);
  const [status, setStatus] = useState('none');

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
        setIncomingRequests((prev) =>
          prev.filter((req) => req.sender_id !== sender_id)
        );
      })
      .catch((err) => console.error('Error accepting request:', err));
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
        setIncomingRequests((prev) =>
          prev.filter((req) => req.sender_id !== sender_id)
        );
      })
      .catch((err) => console.error('Error denying request:', err));
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
  }, [userProfile, profileData]);   const handleAddFriend = () => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Profile picture with hover effect */}
        <div
          className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300
                     flex items-center justify-center mx-auto
                     relative group cursor-pointer"
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
        <div className="text-center mt-4">
          <h1 className="text-3xl font-serif font-bold text-gray-800">
            {username}
          </h1>
          <h2 className="text-2xl font-serif font-semibold">Role: {profileData.role}</h2>

          {/* Add Friend button */}
          {status === 'none' ? (
                <button
                  onClick={handleAddFriend}
                  className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
                >
                  Add Friend
                </button>
              ) : status === 'pending' ? (
                <p className="mt-6 text-green-600">Friend Request Sent!</p>
              ) : status === 'accepted' ? (
                <p className="mt-6 text-green-600">You are already friends!</p>
                ) : status ==='incoming' ? (
                  <>
                  <p className="mt-6 text-green-600">User has sent you a friend request!</p><br />
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
                </>
                ) : null
            }

        </div>
      </div>
    </div>
  );
}
