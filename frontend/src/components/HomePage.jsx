import { useEffect, useState, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import Fuse from 'fuse.js'
import Posts from './subcomponents/Posts.jsx'
import WelcomeModal from './subcomponents/WelcomeModal.jsx';
import { useGetUnreadMessage } from './hooks/useGetUnreadMessage.js';

const HomePage = () => {
  const [user, setUser] = useState(null)
  const [content, setContent] = useState('')
  const [googleUser, setGoogleUser] = useState('')
  const {userProfile, setUserProfile} = useOutletContext({})
  const {userPosts:posts, setUserPosts:setPosts} = useOutletContext()
  const [showTags, setShowTags] = useState(false)
  const [tagValue, setTagValue] = useState('')
  const [tagList, setTagList] = useState([])
  const [isTextareaFocused, setIsTextareaFocused] = useState(false)
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(false)
  const [filteredPosts, setFilteredPosts] = useState([])
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const {searchTrait,setSearchTrait} = useOutletContext()
  useGetUnreadMessage()
  // Check for logged-in user based on isAuthenticated
  useEffect(() => {
    let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      setUser({ email: 'user@example.com' });
      const isNewLogin = sessionStorage.getItem('newLogin') === 'true';
      if (isNewLogin) {
        setShowWelcomeModal(true);
        sessionStorage.removeItem('newLogin');
      }
    } else {
      fetch('/api/google/status')
        .then((response) => response.json())
        .then((googleUserInfo) => {
          if (googleUserInfo?.email) {
            setGoogleUser(googleUserInfo.email);
            const isNewGoogleLogin = sessionStorage.getItem('newGoogleLogin') === 'true';
          if (isNewGoogleLogin) {
            setShowWelcomeModal(true);
            sessionStorage.removeItem('newGoogleLogin');
          }
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
        localStorage.setItem('authUser',JSON.stringify(data.user_id))
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
            setUserProfile(userProfile.unread_count++);
            console.log('Post submitted:', data.post);
            //location.reload();
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
      {/* Displaying user profile */}
      {(user || googleUser) && showWelcomeModal && (
            <WelcomeModal
              email={userProfile.email || googleUser}
              username={userProfile.username || (userProfile.email || googleUser)?.split('@')[0]}
              onClose={() => setShowWelcomeModal(false)}
              pfp_id = {userProfile.pfp_id}
            />
      )}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Post creation section */}
          {searchTrait.length===0 && ((user || googleUser) ? (
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

              <div className={`transition-all duration-300 overflow-y-auto ease-in-out ${isTextareaFocused || isTagsInputFocused || content.trim() || tagValue.trim() ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'}`}>
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
              
              {/* Images Upload Section */}
              <div>
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
          ))}

        </div>

        <Posts posts={filteredPosts} setPosts={setPosts}/>

      </main>
    </div>
  );
};

export default HomePage;

