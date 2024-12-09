import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [googleUser,setGoogleUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    role: '',
  });

  // Fetch user profile on mount
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

  // Check for logged-in user based on JWT token
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      setUser({ email: 'user@example.com' });
    } else {
      fetch('/api/google/status', { credentials: 'include' })
        .then((response) => response.json())
        .then((googleUserInfo) => {
          if (googleUserInfo?.email) {
            setGoogleUser(googleUserInfo);
          } else {
            setGoogleUser(null);
          }
        })
        .catch((error) => {
          console.error('Error checking Google login status:', error);
        });
    }
  }, []);

  // Handle Post Submit
  const handlePostSubmit = () => {
    if (!user) {
      alert('You must be logged in to post.');
      return;
    }

    if (content.trim()) {
      console.log('Post submitted:', content);
      setContent('');
    } else {
      alert('Post content cannot be empty.');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {user || googleUser ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                disabled={!content.trim()}
                onClick={handlePostSubmit}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:bg-gray-400"
              >
                Post
              </button>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md">
              Please <a href="/login" className="text-cyan-600">log in</a> to post.
            </div>
          )}

          {user && (
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="text-gray-800">Welcome, {userProfile.username}</div>
            </div>
          )}
            {googleUser && (
              <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="text-gray-800">Welcome, {googleUser.email}</div>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
