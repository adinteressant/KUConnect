import { useEffect, useState} from 'react'
import { useOutletContext,Link } from 'react-router-dom'
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
  const [moreLoading, setMoreLoading] = useState(false)
  const [fetchOnce, setFetchOnce] = useState(false)
  const [totalPosts, setTotalPosts] = useState(0)
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
  // useEffect(() => {
  //   fetch(`/api/get-posts`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setPosts(() => data)
  //       setTimeout(() => {
  //         setPostLoadingState(() => false)
  //       }, 500)
  //     })
  //     .catch((e) => {
  //       console.error('Error fetching posts:', e)
  //     })
  // }, [])

  // Fetch posts acc to user
  useEffect(() => {
    if(userProfile.user_id)
    {
      if(!fetchOnce)
      {
        setFetchOnce(() => true)
        // setPosts(() => [])
        getHomepagePosts()
      }
    }
  }, [userProfile])

  function getHomepagePosts()
  {
    fetch(`/api/homepage/posts/user/${userProfile.user_id}/get-posts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          homepagePosts: posts.map(p => p._id)
        })
      }
    )
    .then((response) => response.json())
    .then((data) => {
      setPosts((prev) => [...prev, ...data.posts])
      setTotalPosts(() => data.totalPostsInDB)
      setMoreLoading(() => false)
      setPostLoadingState(() => false)
    })
    .catch((e) => {
      console.error('Error fetching posts:', e)
    })
  }

  return (
    <div className="flex-1 flex flex-col dark:bg-slate-900 bg-gray-200 overflow-y-auto scrollbar">
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
            <PostCreateSection user={userProfile} setUser={setUserProfile} setPosts={setPosts} setTotalPosts={setTotalPosts}/>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md">
              Please <Link to="/login" className="text-cyan-600">log in</Link> to post.
            </div>
          )}

        </div>

        {postLoadingState?
        <PostSkeleton />
        :
        <>
          <Posts posts={posts} setPosts={setPosts}/>
          {moreLoading?
          <PostSkeleton />
          :
          (posts.length===0 || (totalPosts===posts.length?
          <div
              className='max-w-2xl p-4 mx-auto rounded-xl text-cyan-600 font-bold text-xl tracking-wide
              flex flex-col justify-center items-center gap-2
              shadow-md bg-white dark:shadow-black dark:bg-slate-800'
          >
            <svg width="60" height="60" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round"
              className='fill-none stroke-cyan-600 stroke-2'
            >
              <path d="M2 20h20"/>
              <path d="m9 10 2 2 4-4"/>
              <rect x="3" y="4" width="18" height="12" rx="2"/>
            </svg>
            <div className='text-center'>
              That's everything we've got for now!
            </div>
          </div>
          :
          <div
            className='max-w-2xl mx-auto rounded-full my-3
              shadow-md bg-white hover:bg-gray-100 hover:text-cyan-600
              dark:shadow-black dark:bg-slate-800 dark:text-slate-200 dark:hover:text-cyan-600 dark:hover:bg-slate-700
              transition-all duration-300'
            >
            <button className='rounded-full p-4 w-full text-center'
              onClick={() => {
                setMoreLoading(() => true)
                getHomepagePosts()
              }}
            >
              Show more
            </button>
          </div>))}
        </>
        }
        
      </main>
    </div>
  )
}

export default HomePage