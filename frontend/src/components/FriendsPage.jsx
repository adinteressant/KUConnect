import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, UserPlus, Clock } from 'lucide-react';
import useRequestCount from '../zustand/useRequestCount';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const { incomingRequestsCount, setIncomingRequestsCount } = useRequestCount();

  const isAuthenticated = localStorage.getItem('isAuthenticated') == 'true'

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

  // Fetch friends, incoming requests, and sent requests
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
          setIncomingRequestsCount(data.incoming.length || 0);
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

  // Accept request
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
        setIncomingRequestsCount(incomingRequestsCount - 1);
        if (acceptedRequest) {
          setFriends((prev) => [
            ...prev,
            { username: acceptedRequest.sender_username, pfp_id: acceptedRequest.pfp_id },
          ]);
        }
      })
      .catch((err) => console.error('Error accepting request:', err))
  };

  // Deny request
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
        setIncomingRequestsCount(incomingRequestsCount - 1);
      })
      .catch((err) => console.error('Error denying request:', err))
  };

  // Cancel sent request
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
      .catch((err) => console.error('Error canceling request:', err))
  };

  const LoadingSkeleton = () => (
    <div className="dark:text-white p-6 overflow-y-auto">
      <div className="mb-8 max-w-6xl mx-auto">
        {/* Title skeleton */}
        <div className="w-32 h-8 bg-gray-200 dark:bg-slate-800 rounded-lg mb-6 animate-pulse" />
        
        {/* Tabs skeleton */}
        <div className="flex space-x-2 mb-6 border-b dark:border-slate-700">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="px-4 py-2 flex items-center gap-2"
            >
              <div className="w-4 h-4 bg-gray-200 dark:bg-slate-800 rounded-full animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
  
        {/* Content skeleton - Grid layout matching friends list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="bg-gray-100 dark:bg-slate-800 rounded-lg shadow p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="w-32 h-6 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if(!isAuthenticated){
    return (
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md m-4">
              Please <Link to="/login" className="text-cyan-600">log in</Link> to view friends.
            </div>
    )
  }
  if (loading) {
    return (
        <LoadingSkeleton />
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }
  return (
    <div className="dark:text-white p-6 overflow-y-auto">
      <div className="mb-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Friends</h1>
        
        <div className="flex space-x-2 dark:text-gray-300 mb-6 border-b dark:border-slate-700">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-cyan-600 border-b-2 dark:text-gray-200 border-cyan-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-cyan-600'
            }`}
          >
            <Users className="w-4 h-4" />
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-cyan-600 dark:text-gray-200 border-b-2 border-cyan-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-cyan-600'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Requests ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'sent'
                ? 'text-cyan-600 border-b-2 dark:text-gray-200 border-cyan-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-cyan-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            Sent ({sentRequests.length})
          </button>
        </div>

        {activeTab === 'friends' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div key={friend.username} className="bg-gray-100 dark:bg-slate-800 dark:text-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.pfp_id ? `/api/get-pfp?id=${friend.pfp_id}` : '/api/placeholder/40/40'}
                    className="h-10 w-10 rounded-full object-cover"
                    alt={`${friend.username}'s profile`}
                  />
                  <Link 
                    to={`/${friend.username}`}
                    className="font-medium"
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
              <div key={req.sender_username} className="bg-gray-100 dark:bg-slate-800 dark:text-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={req.pfp_id ? `/api/get-pfp?id=${req.pfp_id}` : '/api/placeholder/40/40'}
                      className="h-10 w-10 rounded-full object-cover"
                      alt={`${req.sender_username}'s profile`}
                    />
                    <Link 
                      to={`/${req.sender_username}`}
                      className="font-medium"
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
              <div key={req.receiver_username} className="bg-gray-100 dark:bg-slate-800 dark:text-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={req.pfp_id ? `/api/get-pfp?id=${req.pfp_id}` : '/api/placeholder/40/40'}
                      className="h-10 w-10 rounded-full object-cover"
                      alt={`${req.receiver_username}'s profile`}
                    />
                    <Link 
                      to={`/${req.receiver_username}`}
                      className="font-medium"
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