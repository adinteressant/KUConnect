import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Fetch user profile and check Google login status on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/get-user-profile/', {
          withCredentials: true,
        });

        if (response.data) {
          setUser(response.data);
          console.log(user);
        }
        
        // Check if the welcome popup has been shown
        const welcomeShown = localStorage.getItem('welcomeShown');
        if (!welcomeShown) {
          setShowWelcomePopup(true); // Show popup
          localStorage.setItem('welcomeShown', 'true'); // Mark popup as shown
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const checkGoogleLoginStatus = async () => {
      let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthenticated) {
        try {
          const googleUserInfo = await fetch('/api/google/status', { credentials: 'include' }).then(res => res.json());
          if (googleUserInfo?.email) {
            setGoogleUser(googleUserInfo);
          } else {
            setGoogleUser(null);
          }
        } catch (error) {
          console.error('Error checking Google login status:', error);
        }
      } else {
        setUser({ username: 'exampleUser' }); // Example: Use real user data here
      }
    };

    fetchUserProfile();
    checkGoogleLoginStatus();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/fetch-posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  // Handle Post Submit
  const handlePostSubmit = async () => {
    if (!user && !googleUser) {
      alert('You must be logged in to post.');
      return;
    }

    if (content.trim()) {
      try {
        const postData = {
          content,
          username: user?.username || googleUser?.username, // Use username instead of email
          email: user?.email || googleUser?.email, // This can still be used if needed
        };

        const response = await axios.post('/api/create-post', postData, { withCredentials: true });
        if (response.status === 201) {
          setPosts((prevPosts) => [response.data, ...prevPosts]);
          setContent('');
        } else {
          console.error('Error creating post:', response.data.message);
        }
      } catch (error) {
        console.error('Error creating post:', error.response?.data?.message || error);
      }
    } else {
      alert('Post content cannot be empty.');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150" // Replace with a user icon or image URL
                alt="User"
                className="mx-auto rounded-full w-24 h-24 mb-4"
              />
              <h2 className="text-xl font-semibold">
                Welcome, {user?.username || 'User'}! {/* Display username */}
              </h2>
              <p className="text-gray-600">
                {user?.username || 'We’re glad to have you here!'} {/* Display username */}
              </p>
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
          {/* Post Submission Area */}
          {(user || googleUser) ? (
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

          {/* Display Posts */}
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
