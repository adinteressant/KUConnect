import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState({});

  // Fetch user profile
  useEffect(() => {
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

  const user_id = userProfile.user_id;

  // Fetch data after userProfile has been fetched and user_id is available
  useEffect(() => {
    if (!user_id) return;

    setLoading(true);
    Promise.all([
      fetch(`/api/view-friends?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch friends');
          return res.json();
        })
        .then((data) => {
          setFriends(data.friends || []);
        })
        .catch((err) => {
          console.error('Error fetching friends:', err);
          setError('Error loading friends');
        }),

      fetch(`/api/view-incoming-requests?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch incoming requests');
          return res.json();
        })
        .then((data) => {
          setIncomingRequests(data.incoming || []);
        })
        .catch((err) => {
          console.error('Error fetching incoming requests:', err);
          setError('Error loading incoming requests');
        }),

      fetch(`/api/view-sent-requests?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch sent requests');
          return res.json();
        })
        .then((data) => {
          setSentRequests(data.sent || []);
        })
        .catch((err) => {
          console.error('Error fetching sent requests:', err);
          setError('Error loading sent requests');
        }),
    ])
      .finally(() => setLoading(false));
  }, [user_id]);

  const acceptRequest = (_id) => {
    fetch('/api/accept-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id }),
      credentials: 'same-origin'
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to accept request');
        return response.json();
      })
      .then(() => {
        setIncomingRequests((prev) => prev.filter((req) => req._id !== requestId));
        setFriends((prev) => [
          ...prev,
          incomingRequests.find((req) => req._id === requestId),
        ]);
      })
      .catch((err) => console.error('Error accepting request:', err));
  };

  const denyRequest = (requestId) => {
    fetch('/api/deny-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to deny request');
      })
      .then(() => {
        setIncomingRequests((prev) => prev.filter((req) => req._id !== requestId));
      })
      .catch((err) => console.error('Error denying request:', err));
  };

  const cancelRequest = (requestId) => {
    fetch('/api/cancel-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to cancel request');
      })
      .then(() => {
        setSentRequests((prev) => prev.filter((req) => req._id !== requestId));
      })
      .catch((err) => console.error('Error canceling request:', err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Your Friends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="p-4 bg-white shadow rounded">
                <Link to={`/${friend.username}`}>
                  <p>{friend.username}</p>
                </Link>
                <img src={`https://example.com/profile-pics/${friend.pfp_id}`} alt="Profile" />
              </div>
            ))
          ) : (
            <p>No friends found.</p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Incoming Requests</h2>
        {incomingRequests.length > 0 ? (
          incomingRequests.map((req) => (
            <div key={req.sender_username} className="flex items-center justify-between p-4 bg-gray-100 rounded mb-2">
              <Link to={`/${req.sender_username}`}>
                <p>{req.sender_username}</p>
              </Link>
              <div className="flex">
                <button
                  onClick={() => acceptRequest(req._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Confirm
                </button>
                <button
                  onClick={() => denyRequest(req._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Deny
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No incoming requests.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Sent Requests</h2>
        {sentRequests.length > 0 ? (
          sentRequests.map((req) => (
            <div key={req.receiver_username} className="flex items-center justify-between p-4 bg-gray-100 rounded mb-2">
              <Link to={`/${req.receiver_username}`}>
                <p>{req.receiver_username}</p>
              </Link>
              <button
                onClick={() => cancelRequest(req._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ))
        ) : (
          <p>No sent requests.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
