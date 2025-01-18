import { useState, useEffect } from 'react'
import Posts from './subcomponents/Posts.jsx'
import { useTheme } from './context/themeContext.jsx';
export default function SavedPosts()
{
      const {theme, toggleTheme} = useTheme();
    useEffect(() => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [theme]);
    const [userProfile, setUserProfile] = useState({})
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch('/api/get-user-profile')
        .then(response => response.json())
        .then(data => setUserProfile(() => data))
        .catch(err => {
            console.error('Error fetching user profile', err)
        })
    }, [])

    useEffect(() => {
        fetch(`/api/save/get-posts/user/${userProfile.user_id}`)
        .then(response => response.json())
        .then(data => setPosts(() => data.posts))
        .catch(err => {
            console.error('Error fetching saved posts:', err)
        })
    }, [userProfile])

    return(
        <div className='p-6 bg-gray-100'>
            <Posts posts={posts} setPosts={setPosts} savePage={true}/>
        </div>
    )
}