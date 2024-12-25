import React, { useState, useEffect } from 'react';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]); // Default as empty array
  const [incomingRequests, setIncomingRequests] = useState([]); // Default as empty array
  const [sentRequests, setSentRequests] = useState([]); // Default as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      // Fetch friends
      fetch('/api/view-friends', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies with requests
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

      // Fetch friend requests
      fetch('/api/view-requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if necessary
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch requests');
          return res.json();
        })
        .then((data) => {
          setIncomingRequests(data.incoming || []);
          setSentRequests(data.sent || []);
        })
        .catch((err) => {
          console.error('Error fetching requests:', err);
          setError('Error loading requests');
        }),
    ])
      .finally(() => setLoading(false));
  }, []);

  const acceptRequest = (requestId) => {
    fetch('/api/accept-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestId }),
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
              <div key={friend.user_id} className="p-4 bg-white shadow rounded">
                <img
                  src={`/api/get-pfp?id=${friend.pfp_id}`}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full"
                />
                <p className="text-lg font-medium">{friend.username}</p>
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
            <div key={req._id} className="flex items-center justify-between p-4 bg-gray-100 rounded mb-2">
              <p>{req.sender_id}</p>
              <div className="flex">
                <button
                  onClick={() => acceptRequest(req._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Accept
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

      <div>
        <h2 className="text-xl font-semibold">Sent Requests</h2>
        {sentRequests.length > 0 ? (
          sentRequests.map((req) => (
            <div key={req._id} className="p-4 bg-gray-100 rounded mb-2">
              <p>{req.receiver_id}</p>
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
