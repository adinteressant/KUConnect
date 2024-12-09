import { useEffect, useState } from 'react';

const HomePage = () => {
  const [user, setUser] = useState(null); // State for user information
  const [content, setContent] = useState(''); // State for post content
  // Check for logged-in user on component mount
  useEffect(() => {
  const token = localStorage.getItem('isAuthenticated'); // Check for token in localStorage
    if (token) {
      setUser({ email: 'user@example.com' }); // Placeholder for user; replace with actual user data if needed
    } else {
      fetch('/api/google/status', { credentials: 'include' })
        .then((response) => response.json())
        .then((googleUserInfo) => {
          if (googleUserInfo && googleUserInfo.email) {
            setUser(googleUserInfo); // Set Google user info if logged in
          } else {
            setUser(null); // No user logged in
          }
        })
        .catch((e) => {
          console.error('Error checking Google login status:', e);
          setUser(null);
        });
    }
  }, []); // Dependency array left empty to run only once on mount

  const handlePostSubmit = () => {
    if (!user) {
      alert('You must be logged in to post.');
      return;
    }

    if (content.trim()) {
      console.log('Post submitted:', content); // Placeholder for actual post logic
      setContent(''); // Clear the content after submitting
    } else {
      alert('Post content cannot be empty.');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Post Creation Area */}
          {user ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                disabled={!content.trim()} // Disable post button if content is empty
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
        </div>
      </main>
    </div>
  );
};

export default HomePage;
