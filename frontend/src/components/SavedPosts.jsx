import { useState, useEffect } from 'react'
import Posts from './subcomponents/Posts.jsx'
export default function SavedPosts()
{
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
        <div className='p-6'>
            <Posts posts={posts} setPosts={setPosts} savePage={true}/>
        </div>
    )
}