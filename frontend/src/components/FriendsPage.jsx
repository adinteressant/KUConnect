import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, UserPlus, Clock } from 'lucide-react';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState({});

  // Keeping all your existing useEffect and API calls exactly the same
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

  // Keeping all your existing request handling functions
  const acceptRequest = (request_id) => {
    fetch('/api/accept-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request_id }),
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to accept request');
        return response.json();
      })
      .then(() => {
        const acceptedRequest = incomingRequests.find((req) => req.request_id === request_id);
        setIncomingRequests((prev) => prev.filter((req) => req.request_id !== request_id));
        if (acceptedRequest) {
          setFriends((prev) => [
            ...prev,
            { username: acceptedRequest.sender_username, pfp_id: acceptedRequest.pfp_id },
          ]);
        }
      })
      .catch((err) => console.error('Error accepting request:', err));
  };

  const denyRequest = (request_id) => {
    fetch('/api/deny-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request_id }),
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to deny request');
        return response.json();
      })
      .then(() => {
        setIncomingRequests((prev) => prev.filter((req) => req.request_id !== request_id));
      })
      .catch((err) => console.error('Error denying request:', err));
  };

  const cancelRequest = (request_id) => {
    fetch('/api/cancel-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request_id }),
      credentials: 'same-origin',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to cancel request');
        return response.json();
      })
      .then(() => {
        setSentRequests((prev) => prev.filter((req) => req.request_id !== request_id));
      })
      .catch((err) => console.error('Error canceling request:', err));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Friends</h1>
        
        <div className="flex space-x-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Users className="w-4 h-4" />
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Requests ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'sent'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            Sent ({sentRequests.length})
          </button>
        </div>

        {activeTab === 'friends' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div key={friend.username} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.pfp_id ? `/api/get-pfp?id=${friend.pfp_id}` : '/api/placeholder/40/40'}
                    className="h-10 w-10 rounded-full object-cover"
                    alt={`${friend.username}'s profile`}
                  />
                  <Link 
                    to={`/${friend.username}`}
                    className="font-medium hover:text-blue-600 hover:underline"
                  >
                    {friend.username}
                  </Link>
                </div>
              </div>
            ))}
            {friends.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No friends yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {incomingRequests.map((req) => (
              <div key={req.sender_username} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={req.pfp_id ? `/api/get-pfp?id=${req.pfp_id}` : '/api/placeholder/40/40'}
                      className="h-10 w-10 rounded-full object-cover"
                      alt={`${req.sender_username}'s profile`}
                    />
                    <Link 
                      to={`/${req.sender_username}`}
                      className="font-medium hover:text-blue-600 hover:underline"
                    >
                      {req.sender_username}
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptRequest(req.request_id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => denyRequest(req.request_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {incomingRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No incoming friend requests
              </div>
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentRequests.map((req) => (
              <div key={req.receiver_username} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={req.pfp_id ? `/api/get-pfp?id=${req.pfp_id}` : '/api/placeholder/40/40'}
                      className="h-10 w-10 rounded-full object-cover"
                      alt={`${req.receiver_username}'s profile`}
                    />
                    <Link 
                      to={`/${req.receiver_username}`}
                      className="font-medium hover:text-blue-600 hover:underline"
                    >
                      {req.receiver_username}
                    </Link>
                  </div>
                  <button
                    onClick={() => cancelRequest(req.request_id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
            {sentRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No sent friend requests
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;