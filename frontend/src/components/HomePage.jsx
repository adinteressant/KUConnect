import { useEffect, useState} from 'react'
import { useOutletContext } from 'react-router-dom'
import Posts from './subcomponents/Posts.jsx'
import WelcomeModal from './subcomponents/WelcomeModal.jsx'
import { useGetUnreadMessage } from './hooks/useGetUnreadMessage.js'
import PostSkeleton from './subcomponents/PostSkeleton.jsx'
import PostCreateSection from './subcomponents/PostCreateSection.jsx'

const HomePage = () => {
  const [user, setUser] = useState(null)
  const [googleUser, setGoogleUser] = useState('')
  const {userProfile, setUserProfile} = useOutletContext()
  const {userPosts:posts, setUserPosts:setPosts} = useOutletContext()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [postLoadingState, setPostLoadingState] = useState(true)
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
        setPosts(() => data)
        setTimeout(() => {
          setPostLoadingState(() => false)
        }, 2000)
      })
      .catch((e) => {
        console.error('Error fetching posts:', e)
      })
  }, [])

  return (
    <div className="flex-1 flex flex-col dark:bg-slate-900 bg-gray-200 overflow-y-auto">
      {/* Displaying user profile */}
      {(user || googleUser) && showWelcomeModal && ( 
            <WelcomeModal
              email={userProfile.email || googleUser}
              username={userProfile.username || (userProfile.email || googleUser)?.split('@')[0]}
              onClose={() => setShowWelcomeModal(false)}
              pfp_id = {userProfile.pfp_id}
            />
      )}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Post creation section */}
          {(user || googleUser) ? (
            <PostCreateSection user={userProfile} setUser={setUserProfile} setPosts={setPosts}/>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md">
              Please <a href="/login" className="text-cyan-600">log in</a> to post.
            </div>
          )}

        </div>

        {postLoadingState?
        <PostSkeleton />
        :
        <Posts posts={posts} setPosts={setPosts}/>
        }
        
      </main>
    </div>
  )
}

export default HomePage