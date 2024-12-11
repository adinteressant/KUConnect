import { useEffect, useState } from 'react';

const HomePage = () => {
 
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [googleUser, setGoogleUser] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const [posts, setPosts] = useState([]); // Store posts in state


  // Check for logged-in user based on isAuthenticated
  
  useEffect(() => {
    let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' ? true : false;
    if (isAuthenticated) {
      setUser({ email: 'user@example.com' });
    } else {
      fetch('/api/google/status')
        .then((response) => response.json())
        .then((googleUserInfo) => {
          if (googleUserInfo?.email) {
            setGoogleUser(googleUserInfo.email);
          }
        })
        .catch((error) => {
          console.error('Error checking Google login status:', error);
        });
    }
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    fetch('/api/get-user-profile')
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data); // Ensure user_id is fetched and set properly
      })
      .catch((e) => {
        console.error('Error fetching user profile:', e);
      });
  }, []);

  // Fetch all posts on mount
  useEffect(() => {
    fetch('/api/get-posts')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data); // Store posts in the state
      },[posts])
      .catch((e) => {
        console.error('Error fetching posts:', e);
      });
  }, []);

  // Handle Post Submit
  const handlePostSubmit = () => {
    if (!user && !googleUser) {
      alert('You must be logged in to post.');
      return;
    }

    if (content.trim()) {
      const userInfo = userProfile || googleUser;  // Ensure that userProfile includes user_id

      // Send the post request with user info
      fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          userInfo, 
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.post) {
            setContent('');
            setPosts([data.post, ...posts]); // Add the new post to the state and prepend it
            console.log('Post submitted:', data.post);
          }
        })
        .catch((error) => {
          console.error('Error submitting post:', error);
        });
    } else {
      alert('Post content cannot be empty.');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Post creation section */}
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

          {/* Displaying user profile */}
          {(user || googleUser) && (
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="text-gray-800">Welcome, {userProfile.username || userProfile.email?.split('@')[0]}</div>
              {/* Displaying user_id */}
            </div>
          )}

          {/* Displaying posts */}
          <div className="mt-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <div className="text-gray-800 font-semibold">{post.username || post.email.split('@')[0]}</div>
                  <div className="text-gray-600 text-sm">{new Date(post.createdAt).toLocaleString()}</div>
                  <p className="mt-2 text-gray-800">{post.content}</p>
                  {post.tags.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Tags: {post.tags.join(', ')}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
                No posts available.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
