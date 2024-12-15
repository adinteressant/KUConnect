import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom'
import Fuse from 'fuse.js';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [googleUser, setGoogleUser] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showTags, setShowTags] = useState(false);
  const [tagValue, setTagValue] = useState('');
  const [tagList, setTagList] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(false);
  const {searchTrait,setSearchTrait} = useOutletContext();

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
    fetch(`/api/get-posts`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
      })
      .catch((e) => {
        console.error('Error fetching posts:', e);
      }); ///AHHHHHHHHHHHH WHERE IS MY COMMENT, I HATE AI
  }, []);

  useEffect(() => {
    const options = {
      keys: ['content', 'username'],
      useExtendedSearch: true,
    }

    const fuse = new Fuse(posts, options);
    
    const result = fuse.search(`'${searchTrait}`);
    
    let filResult = result.map(item => item.item); // FILTERED RESULT
    
    if (!searchTrait.length) {
      setFilteredPosts(posts);
      filResult = posts; //IF THE SEARCH BAR IS EMPTY ALL POSTS APPEAR
    }
    setFilteredPosts(filResult); // ELSE FILTERED POSTS
  }, [searchTrait, posts]);

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

  //Handle like in post
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

  function toggleCommentBox() {
    setShowCommentBox((prev) => !prev)
  }

  const handleTextareaFocus = () => {
    setIsTextareaFocused(true);
    setShowTags(true);
  };

  const handleTextareaBlur = () => {
    setIsTextareaFocused(false);
    if (!content.trim() && !isTagsInputFocused && !tagValue.trim()) {
      setShowTags(false);
    }
  };

  const handleTagsInputFocus = () => {
    setIsTagsInputFocused(true);
    setShowTags(true);
  };

  const handleTagsInputBlur = () => {
    setIsTagsInputFocused(false);
    if (!content.trim() && !isTextareaFocused && !tagValue.trim()) {
      setShowTags(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Post creation section */}
          {(user || googleUser) ? (
            <div
              className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 h-auto`}
            >
              <textarea
                placeholder="What's on your mind?"
                className={`w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all duration-300 ${
                  isTextareaFocused || isTagsInputFocused ? 'h-28' : 'h-20'
                }`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
              />

              <div className={`transition-all duration-300 ${isTextareaFocused || isTagsInputFocused || content.trim() || tagValue.trim() ? 'opacity-100' : 'opacity-0'}`}>
                <input
                  type="text"
                  placeholder="Add tags (space-separated)"
                  className="w-full p-2 border rounded-lg mb-4 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all duration-300"
                  value={tagValue}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  onFocus={handleTagsInputFocus}
                  onBlur={handleTagsInputBlur}
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
              
              <button
                disabled={!content.trim()}
                onClick={handlePostSubmit}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:bg-gray-400 transition-all duration-300"
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
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className={`bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-300 ${
                    post.isUpdating ? 'scale-105' : 'scale-100'
                  }`}
                >
                  <Link 
                  to={post.username === userProfile.username?'/myprofile':`/${post.username}`}>
                    <div className="text-gray-800 font-semibold">{post.username}</div>
                  </Link>
                   {/* Display username */}
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
                  
                  {/* Likes, Comments, Shares Information */}
                  <div className='mt-2 flex items-center gap-4'>

                    {/* like information */}
                      {post.likes.length>0 &&
                        <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                          {(post.likes.length<3
                            ? `Liked by ${post.likes.map(user => user.username).join(', ')}`
                            : `Liked by ${post.likes.map(user => user.username).slice(-2).join(', ')} and ${post.likes.length-2} more`
                          )}
                        </button>
                      }

                    <div className='ml-auto flex items-center gap-4'>
                      
                        {/* comment information */}
                        {post.comments.length>0 &&
                          <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                            {post.comments.length} comments
                          </button>
                        }

                        {/* share information */}
                        {post.shares.length>0 &&
                          <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-200">  
                            {post.shares.length} shares
                          </button>
                        }
                    </div>
                  </div>

                  {/* Like, Comment, Share Button */}
                  <div className='flex items-center gap-4 mt-2'>

                    {/* like button */}
                    <button onClick = {() => handleLike(post)} className = 'flex items-center gap-2 group'>
                      <svg width='24' height='24' viewBox='0 0 24 24'
                      className= {isLiked(post)
                        ? 'stroke-cyan-600 fill-cyan-600 group-hover:fill-cyan-700 group-hover:stroke-cyan-700 transition-all duration-100'
                        : 'stroke-gray-600 fill-none group-hover:stroke-cyan-600 transition-all duration-200'}
                      xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/>
                      </svg>
                      
                      <span className = {
                          isLiked(post)
                          ? 'text-cyan-600 group-hover:text-cyan-700 transition-all duration-100'
                          : 'text-gray-600 group-hover:text-cyan-600 transition-all duration-200'
                      }>
                        {isLiked(post)
                        ? 'Liked' 
                        : 'Like'
                        }
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
                  {showCommentBox && (<div className="mt-4">
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
                  </div>)}

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

