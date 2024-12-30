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
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);

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
          setIsFriendRequestSent(true);
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
          {!isFriendRequestSent ? (
            <button
              onClick={handleAddFriend}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Add Friend
            </button>
          ) : (
            <p className="mt-6 text-green-600">Friend Request Sent!</p>
          )}
        </div>
      </div>
    </div>
  );
}
