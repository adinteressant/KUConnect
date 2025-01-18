import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './context/themeContext';

const SearchResults = () => {
    const location = useLocation();
    const { posts: initialPosts, searchTag } = location.state || { posts: [], searchTag: '' };
    const [posts, setPosts] = useState(initialPosts); // Added state for posts
    const [userProfile, setUserProfile] = useState({});
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [googleUser, setGoogleUser] = useState('');
    const [user, setUser] = useState(null); // Added user state
      const {theme, toggleTheme} = useTheme();
    useEffect(() => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [theme]);
  
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

  const handleLike = async(post) => {
    if (!user && !googleUser) {
      alert('You must be logged in to like the post.');
      return;
    }
    
    try {
      const response = await fetch(`/api/posts/${post._id.toString()}/toggle-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: (userProfile.user_id || googleUser.user_id),
          username: (userProfile.username || googleUser.username)
        })
      })

      const updatedPost = await response.json()
      if(response.ok)
      {
        setPosts((prevPosts) => 
          prevPosts.map((p) =>
            p._id === updatedPost.post._id ? { ...updatedPost.post, isUpdating: true } : p
          )
        )
        
        // Reset the isUpdating state after animation
        setTimeout(() => {
          setPosts((prevPosts) =>
            prevPosts.map((p) =>
              p._id === updatedPost.post._id ? { ...p, isUpdating: false } : p
            )
          )
        }, 300) // Match this with the animation duration
      }
      else
      {
        console.error('Error liking post:', updatedPost.message)
      }
    }
    catch(error) {
      console.error('Error toggling like:', error)
    }
  }

  const isLiked = (post) => {
    return post.likes.some((like) => like && (like.userId === (userProfile.user_id || googleUser.user_id)))
  }

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-serif mb-6">
            Search Results for Tag: <span className="text-cyan-600">#{searchTag}</span>
          </h2>

          {posts.length === 0 ? (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
              No posts found with the tag "{searchTag}".
            </div>
          ) : (
            <div className="mt-8">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className={`bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-300`}
                >
                  <Link 
                    to={post.username === userProfile.username ? '/myprofile' : `/${post.username}`}
                    className="flex items-center mb-2"
                  >
                    <img 
                      src={`/api/get-pfp?id=${post.pfp_id}`}
                      className="h-8 w-8 rounded-full object-cover mr-2"
                      alt={`${post.username}'s profile`}
                    />
                    <div className="text-gray-800 font-semibold">{post.username}</div>
                  </Link>

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

                  <hr className='mt-2'/>
                  
                  <div className='mt-2 flex items-center gap-4'>
                    {post.likes.length > 0 && (
                      <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                        {(post.likes.length < 3
                          ? `Liked by ${post.likes.map(user => user.username).join(', ')}`
                          : `Liked by ${post.likes.map(user => user.username).slice(-2).join(', ')} and ${post.likes.length-2} more`
                        )}
                      </button>
                    )}

                    <div className='ml-auto flex items-center gap-4'>
                      {post.comments.length > 0 && (
                        <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                          {post.comments.length} comments
                        </button>
                      )}

                      {post.shares > 0 && (
                        <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                          {post.shares} shares
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Like, Comment, Share Button */}
                  <div className='flex items-center gap-4 mt-2'>
                    {/* like button */}
                    <button onClick={() => handleLike(post)} className='flex items-center gap-2 group'>
                      <svg width='24' height='24' viewBox='0 0 24 24'
                        className={isLiked(post)
                          ? 'stroke-cyan-600 fill-cyan-600 group-hover:fill-cyan-700 group-hover:stroke-cyan-700 transition-all duration-100'
                          : 'stroke-gray-600 fill-none group-hover:stroke-cyan-600 transition-all duration-200'}
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/>
                      </svg>
                      
                      <span className={
                        isLiked(post)
                        ? 'text-cyan-600 group-hover:text-cyan-700 transition-all duration-100'
                        : 'text-gray-600 group-hover:text-cyan-600 transition-all duration-200'
                      }>
                        {isLiked(post) ? 'Liked' : 'Like'}
                      </span>
                    </button>

                    {/* comment button */}
                    <button onClick={toggleCommentBox} className='ml-auto flex items-center gap-2 group'>
                      <svg width='24' height='24' viewBox='0 0 24 24'
                        className='stroke-gray-600 fill-none group-hover:stroke-cyan-600 transition-all duration-200'
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                      </svg>

                      <span className='text-gray-600 group-hover:text-cyan-600 transition-all duration-200'>
                        Comment
                      </span>
                    </button>

                    {/* share button */}
                    <button className='ml-auto flex items-center gap-2 group'>
                      <svg width='24' height='24' viewBox='0 0 24 24'
                        className='stroke-gray-600 fill-none group-hover:stroke-cyan-600 transition-all duration-200'
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                        <path d="m21.854 2.147-10.94 10.939"/>
                      </svg>

                      <span className='text-gray-600 group-hover:text-cyan-600 transition-all duration-200'>
                        Share
                      </span>
                    </button>
                  </div>

                  {/* Comment Input Section */}
                  {showCommentBox && (
                    <div className="mt-4">
                      <textarea
                        placeholder="Add a comment..."
                        className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                      />
                      <button
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        disabled
                      >
                        Comment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
