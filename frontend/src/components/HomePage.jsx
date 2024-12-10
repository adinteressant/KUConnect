import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext'; 
import axios from 'axios';
import Cookies from 'js-cookie';

const HomePage = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    const checkTokensAndAuthenticate = async () => {
      try {
        const jwtToken = Cookies.get('JWT_TOKEN');
        const refreshToken = Cookies.get('REFRESH_TOKEN');

        if (jwtToken || refreshToken) {
          // Fetch posts or other data from backend if authenticated
          const response = await axios.get('/api/get-posts', { withCredentials: true });
          setPosts(response.data); // Populate posts
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    checkTokensAndAuthenticate();
  }, [isAuthenticated]);

  const handlePostSubmit = async () => {
    if (!content.trim()) {
      alert('Content cannot be empty.');
      return;
    }

    try {
      const postData = {
        content,
        username: user?.username,  // Use user details from the context
        email: user?.email,
      };

      const response = await axios.post('/api/create-post', postData, { withCredentials: true });
      setContent(''); // Clear input field
      setPosts((prev) => [response.data, ...prev]); // Add new post to list
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {showWelcomePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <img src="https://via.placeholder.com/150" alt="User" className="mx-auto rounded-full w-24 h-24 mb-4" />
              <h2 className="text-xl font-semibold">Welcome, {user?.username || 'User'}!</h2>
              <p className="text-gray-600">{user?.email || 'We’re glad to have you here!'}</p>
              <button
                onClick={() => setShowWelcomePopup(false)}
                className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {isAuthenticated ? (
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
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 focus:outline-none"
              >
                Post
              </button>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md">
              Please <a href="/login" className="text-cyan-600">log in</a> to post.
            </div>
          )}
          <div className="space-y-4 mt-8">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
