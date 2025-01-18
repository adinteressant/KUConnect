import { useEffect, useState} from 'react'
import { useOutletContext } from 'react-router-dom'
import Posts from './subcomponents/Posts.jsx'
import WelcomeModal from './subcomponents/WelcomeModal.jsx'
import { useGetUnreadMessage } from './hooks/useGetUnreadMessage.js'
import base64encode from '../utils/base64encode.js'

const HomePage = () => {
  const [user, setUser] = useState(null)
  const [content, setContent] = useState('')
  const [googleUser, setGoogleUser] = useState('')
  const {userProfile, setUserProfile} = useOutletContext()
  const {userPosts:posts, setUserPosts:setPosts} = useOutletContext()
  const [showTags, setShowTags] = useState(false)
  const [tagValue, setTagValue] = useState('')
  const [tagList, setTagList] = useState([])
  const [isTextareaFocused, setIsTextareaFocused] = useState(false)
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(false)
  const [images, setImages] = useState([])
  const [encodedImages, setEncodedImages] = useState([])
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const {searchTrait,setSearchTrait} = useOutletContext()
  // Check for logged-in user based on isAuthenticated
  if(localStorage.getItem('isLoggedIn') === 'true') useGetUnreadMessage()
  
    useEffect(() => {
    let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'  
    if (isAuthenticated) {
      setUser({ email: 'user@example.com' })
      const isNewLogin = sessionStorage.getItem('newLogin') === 'true'
      if (isNewLogin) {
        setShowWelcomeModal(true)
        sessionStorage.removeItem('newLogin')
      }
    } else {
      fetch('/api/google/status')
        .then((response) => response.json())
        .then((googleUserInfo) => {
          if (googleUserInfo?.email) {
            setGoogleUser(googleUserInfo.email)
            const isNewGoogleLogin = sessionStorage.getItem('newGoogleLogin') === 'true'
          if (isNewGoogleLogin) {
            setShowWelcomeModal(true)
            sessionStorage.removeItem('newGoogleLogin')
          }
          }
        })
        .catch((error) => {
          console.error('Error checking Google login status:', error)
        })
    }
  }, [])

  // Fetch user profile on mount
  useEffect(() => {
    fetch('/api/get-user-profile')
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data)
        localStorage.setItem('authUser',JSON.stringify(data.user_id))
      })
      .catch((e) => {
        console.error('Error fetching user profile:', e)
      })
  }, [])

  // Fetch all posts on mount
  useEffect(() => {
    fetch(`/api/get-posts`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data)
      })
      .catch((e) => {
        console.error('Error fetching posts:', e)
      }) ///AHHHHHHHHHHHH WHERE IS MY COMMENT, I HATE AI
  }, [])

  // Handle Post Submit
  const handlePostSubmit = () => {
    if (!user && !googleUser) {
      alert('You must be logged in to post.')
      return
    }

    if (content.trim()) {
      const userInfo = userProfile || googleUser

      const formData = new FormData()

      formData.append('content', content)
      formData.append('userInfo', JSON.stringify(userInfo))
      formData.append('tags', JSON.stringify(tagList))
      encodedImages.forEach((image) => {
        formData.append('images', image)
      })

      fetch('/api/create-post', {
        method: 'POST',
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.post) {
            setContent('')
            setTagValue('')
            setTagList([])
            setImages([])
            setEncodedImages([])
            setPosts([data.post, ...posts])
            setUserProfile(userProfile.unread_count++)
            console.log('Post submitted:', data.post)
            //location.reload()
          }
        })
        .catch((error) => {
          console.error('Error submitting post:', error)
        })
    } else {
      alert('Post content cannot be empty.')
    }
  }

  // Handle Tag Input Change
  const handleTagInputChange = (e) => {
    const value = e.target.value
    if (value.endsWith(' ')) {
      const trimmedValue = value.trim()
      if (trimmedValue && !tagList.includes(trimmedValue)) {
        setTagList([...tagList, trimmedValue])
      }
      setTagValue('')
    } else {
      setTagValue(value)
    }
  }

  // Handle Backspace Key for Tag Removal
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Backspace' && !tagValue && tagList.length > 0) {
      const updatedTags = [...tagList]
      updatedTags.pop()
      setTagList(updatedTags)
    }
  }

  const handleTextareaFocus = () => {
    setIsTextareaFocused(true)
    setShowTags(true)
  }

  const handleTextareaBlur = () => {
    setIsTextareaFocused(false)
    if (!content.trim() && !isTagsInputFocused && !tagValue.trim()) {
      setShowTags(false)
    }
  }

  const handleTagsInputFocus = () => {
    setIsTagsInputFocused(true)
    setShowTags(true)
  }

  const handleTagsInputBlur = () => {
    setIsTagsInputFocused(false)
    if (!content.trim() && !isTextareaFocused && !tagValue.trim()) {
      setShowTags(false)
    }
  }

  const handleImageChange = async(e) => 
  {
    const encodedImageFiles = await base64encode(Array.from(e.target.files));
    const selectedImages = Array.from(e.target.files);
    const maxSize = 10*1024*1024
    const validExtensions = ['image/jpeg','image/png','image/gif','image/webp']
    if(selectedImages.some((image) => image.size>maxSize))
    {
      alert('Each image must be less than 10MB')
    }
    else if(selectedImages.some((image) => !validExtensions.includes(image.type)))
    {
      alert('Each image must be of type jpeg, png, gif or webp')
    }
    else
    {
      setImages((prev) => {
        const i = [...prev, ...selectedImages]
        if(i.length > 10)
        {
          i.splice(10)
        }
        return i
      })
      setEncodedImages(
        (prev) => {
            const i = [...prev, ...encodedImageFiles]
            if(i.length > 10)
            {
              i.splice(10)
            }
            return i
          }
      )
    }
  }

  const handleImageRemove = (index) =>
  {
    setImages((prev) => prev.filter((_, i) => i!==index))
    setEncodedImages((prev) => prev.filter((_, i) => i!==index))
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen dark:bg-slate-900 bg-white">
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
          {(user || googleUser) ? (
            <div
              className={`dark:bg-gray-900 bg-white p-4 rounded-lg shadow-md transition-all duration-300 h-auto`}
            >
              <textarea
                placeholder="What's on your mind?"
                className={`w-full p-2 border rounded-lg dark:bg-slate-800 dark:text-gray-200 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all duration-300 ${
                  isTextareaFocused || isTagsInputFocused ? 'h-28' : 'h-20'
                }`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
              />

              <div className={`transition-all duration-1000 overflow-y-auto ease-in-out ${isTextareaFocused || isTagsInputFocused || content.trim() || tagValue.trim() || tagList.length>0 || images.length>0 ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'}`}>
                {/*Tag Input Section*/}
                <div className='flex flex-col'>
                  <input
                    type="text"
                    placeholder="Add tags (space-separated)"
                    className="mt-4 flex-1 p-2 border rounded-lg dark:text-gray-200 dark:bg-slate-800 bg-gray-100 focus:m-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all duration-300"
                    value={tagValue}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    onFocus={handleTagsInputFocus}
                    onBlur={handleTagsInputBlur}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
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
                <div className='mt-4'>
                  <input
                    type = 'file'
                    accept = 'image/*'
                    multiple
                    onChange = {(e) => handleImageChange(e)}
                    className = 'hidden'
                    id = 'image-upload'
                  />
                  <div className = 'flex flex-wrap gap-2'>
                    {images.map((image, index) => (
                      <div key={index} className='relative'>
                        <img src={URL.createObjectURL(image)} alt='Preview' className='w-20 h-20 object-cover rounded-lg'/>
                        <button onClick={() => handleImageRemove(index)} className='p-0.5 absolute top-0 right-0 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300'>
                          <svg width='12' height='12' viewBox='0 0 24 24'
                            className='stroke-2 stroke-gray-100'
                          >
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                          </svg>
                        </button>
                      </div>))
                    }
                    {images.length >= 10 || 
                    (<label
                      htmlFor='image-upload'
                      className = 'flex flex-col items-center justify-center text-center w-20 h-20 rounded-lg text-sm border-dashed border-2 border-gray-400 dark:text-gray-200 text-gray-400 hover:text-cyan-600 hover:border-cyan-600 cursor-pointer transition-all duration-300'
                    >
                      Upload Images
                    </label>)
                    }                
                  </div>
                </div>
              </div> 
              <button
                disabled={!content.trim()}
                onClick={handlePostSubmit}
                className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:bg-gray-400 transition-all duration-300"
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

        <Posts posts={posts} setPosts={setPosts}/>

      </main>
    </div>
  )
}

export default HomePage

