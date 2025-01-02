import { useState, useEffect } from 'react';

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

        // Fetch profile picture if pfp_id is available
        if (data.pfp_id) {
          setProfilePic(`/api/get-pfp?id=${data.pfp_id}`);
        } else {
          setProfilePic(null); // No profile picture available
        }
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

  // const confirmRequest = () => {
  //   const receiver_id = userProfile.user_id;
  //   const sender_id = profileData.user_id;

  //   fetch('/api/confirm-request', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ sender_id, receiver_id }),
  //     credentials: 'same-origin',
  //   })
  //     .then((response) => {
  //       if (!response.ok) throw new Error('Failed to accept request');
  //       return response.json();
  //     })
  //     .then(() => {
  //       setStatus('accepted');
  //     })
  //     .catch((err) => console.error('Error accepting request:', err));
  // };

  // const rejectRequest = () => {
  //   const receiver_id = userProfile.user_id;
  //   const sender_id = profileData.user_id;

  //   fetch('/api/reject-request', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ sender_id, receiver_id }),
  //     credentials: 'same-origin',
  //   })
  //     .then((response) => {
  //       if (!response.ok) throw new Error('Failed to deny request');
  //       return response.json();
  //     })
  //     .then(() => {
  //       setStatus('none');
  //     })
  //     .catch((err) => console.error('Error denying request:', err));
  // };

  
  return (
    <div className="px-4 py-3 border-b border-gray-200 sticky">
      <div className="flex items-center gap-3">
      {loading ? (
  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
) : profileData.pfp_id && !error ? (
  <img
    src={`/api/get-pfp?id=${profileData.pfp_id}`}
    alt={`${username}'s profile`}
    className="w-10 h-10 rounded-full object-cover border border-gray-200"
    onError={() => {
      setError(true);
      setProfilePic(null);
    }}
  />
) : (
  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
    <span className="text-indigo-600 font-medium">
      {username?.charAt(0)?.toUpperCase() || '?'}
    </span>
  </div>
)}
        <div className="font-medium text-gray-900">{username}</div>
      </div>
    
  </div>
  );
}
