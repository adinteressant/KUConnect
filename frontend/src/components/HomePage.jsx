import { useEffect, useState } from 'react';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [googleUser, setGoogleUser] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [showTags, setShowTags] = useState(false); // State to toggle tags section
  const [tagValue, setTagValue] = useState('');
  const [tagList, setTagList] = useState([]);

  // Check for logged-in user based on isAuthenticated
  useEffect(() => {
    let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
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
        setUserProfile(data);
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
        setPosts(data);
      })
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
      const userInfo = userProfile || googleUser;

      fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          userInfo,
          tags: tagList,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.post) {
            setContent('');
            setTagValue('');
            setTagList([]);
            setPosts([data.post, ...posts]);
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

  // Handle Tag Input Change
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(' ')) {
      const trimmedValue = value.trim();
      if (trimmedValue && !tagList.includes(trimmedValue)) {
        setTagList([...tagList, trimmedValue]);
      }
      setTagValue('');
    } else {
      setTagValue(value);
    }
  };

  // Handle Backspace Key for Tag Removal
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Backspace' && !tagValue && tagList.length > 0) {
      const updatedTags = [...tagList];
      updatedTags.pop();
      setTagList(updatedTags);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Post creation section */}
          {(user || googleUser) ? (
            <div
              className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 ${
                showTags ? 'h-auto' : 'h-32'
              }`}
            >
              <textarea
                placeholder="What's on your mind?"
                className={`w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all duration-300 ${
                  showTags ? 'h-28' : 'h-20'
                }`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setShowTags(true)} // Show tags section on focus
              />

              {showTags && (
                <div>
                  <input
                    type="text"
                    placeholder="Add tags (space-separated)"
                    className="w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all duration-300"
                    value={tagValue}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                  />
                  <div className="flex flex-wrap gap-2">
                    {tagList.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
            </div>
          )}

          {/* Displaying posts */}
          <div className="mt-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <div className="text-gray-800 font-semibold">{post.username || post.email.split('@')[0]}</div>
                  <div className="text-gray-600 text-sm">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}, {new Date(post.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
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
