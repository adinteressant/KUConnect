import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Posts from './subcomponents/Posts.jsx'
import PostSkeleton from './subcomponents/PostSkeleton.jsx'

export default function SavedPosts()
{
    const [posts, setPosts] = useState([])
    const [ loadingState, setLoadingState ] = useState(true)

    const isAuthenticated = localStorage.getItem('isAuthenticated') == 'true'

    useEffect(() => {
        fetch('/api/get-user-profile')
        .then(response => response.json())
        .then(data => {
            fetch(`/api/save/get-posts/user/${data.user_id}`)
            .then(response => response.json())
            .then(postdata => {
                setPosts(() => postdata.posts)
                setTimeout(() => {
                    setLoadingState(() => false)
                }, 1000)
            })
            .catch(err => {
                console.error('Error fetching saved posts:', err)
            })
        })
        .catch(err => {
            console.error('Error fetching user profile', err)
        })
    }, [])
    if(!isAuthenticated){
        return (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md mt-4">
                  Please <Link to="/login" className="text-cyan-600">log in</Link> to view saved posts.
                </div>
        )
      }
    return(
        <div className='p-4 pt-0 overflow-y-auto'>
            {loadingState?
            <PostSkeleton/>
            :
            <Posts posts={posts} setPosts={setPosts} savePage={true}/>
            }
        </div>
    )
}