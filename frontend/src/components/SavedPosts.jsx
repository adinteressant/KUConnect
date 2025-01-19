import { useState, useEffect } from 'react'
import Posts from './subcomponents/Posts.jsx'
import PostSkeleton from './subcomponents/PostSkeleton.jsx'

export default function SavedPosts()
{
    const [userProfile, setUserProfile] = useState({})
    const [posts, setPosts] = useState([])
    const [ loadingState, setLoadingState ] = useState(true)

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
        .then(data => {
            setPosts(() => data.posts)   
            setLoadingState(() => false)
        })
        .catch(err => {
            console.error('Error fetching saved posts:', err)
        })
    }, [userProfile])

    return(
        <div className='p-6'>
            {loadingState?
            <PostSkeleton/>
            :
            <Posts posts={posts} setPosts={setPosts} savePage={true}/>
            }
        </div>
    )
}