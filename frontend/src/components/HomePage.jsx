import { useEffect, useState } from 'react';

const HomePage = () => {
  const [googleUser, setGoogleUser] = useState(null); // Check for Google login
  const [content, setContent] = useState(''); // State for new post content
  const [posts, setPosts] = useState([]); // State to store posts

  // Fetch Google user information on load
  useEffect(() => {
    fetch('/api/google/status', { credentials: 'include' })
      .then((response) => response.json())
      .then((googleUserInfo) => {
        if (googleUserInfo && googleUserInfo.email) {
          setGoogleUser(googleUserInfo); // Set Google user info if logged in
        } else {
          setGoogleUser(null); // Set null if not authenticated
        }
      })
      .catch((e) => {
        console.error('Failed to fetch Google user status:', e);
        setGoogleUser(null);
      });

    // Fetch posts
    fetch('/api/posts/all', { credentials: 'include' })
      .then((response) => response.json())
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
      })
      .catch((e) => {
        console.error('Failed to fetch posts:', e);
      });
  }, []);

  // Handle post creation
  const handlePost = () => {
    if (!googleUser) {
      alert('You must be logged in to post.');
      return;
    }
  
    if (!content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }
  
    const token = localStorage.getItem('jwtToken');  // Assuming you're storing the token here
  
    fetch('/api/posts/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,  // Pass the token in the Authorization header
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create post');
        }
        return response.json();
      })
      .then((newPost) => {
        setPosts([newPost, ...posts]);
        setContent('');
      })
      .catch((e) => {
        console.error('Failed to create post:', e);
      });
  };
  

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Post Creation Area */}
          {googleUser ? (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                onClick={handlePost} // Trigger post creation
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
              >
                Post
              </button>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md">
              Please <a href="/login" className="text-cyan-600">log in</a> with Google to post.
            </div>
          )}

          {/* Display Posts */}
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
<<<<<<< HEAD
                <img 
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1733666784~exp=1733670384~hmac=034d09dc5141bd8909e5c0eefdcaffae16d03173368ccc0146b8a0368fc432e7&w=740" 
                  alt="User" 
=======
                <img
                  src="/api/placeholder/40/40"
                  alt="User"
>>>>>>> origin/suyog
                  className="rounded-full w-10 h-10 mr-3"
                />
                <div>
                  <h3 className="font-serif">{post.username || 'Anonymous'}</h3>
                  <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
