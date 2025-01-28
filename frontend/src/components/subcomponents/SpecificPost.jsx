import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Posts from './Posts'
import PostSkeleton from './PostSkeleton'

export default function SpecificPost()
{
    const { postId } = useParams()
    const [posts, setPosts] = useState([])
    const [ loadingState, setLoadingState ] = useState(true)

    useEffect(() =>{
        fetch(`/api/post/${postId}`)
        .then(response => response.json())
        .then(data => {
            setPosts(() => data.post)
            setTimeout(() => {
                setLoadingState(() => false)
            }, 500)
        })
        .catch(error => {
            console.error('Error fetching post', error)
        })
    }, [postId])

    return(
        <div className='p-4 pt-0 overflow-y-auto scrollbar h-full bg-gray-200 dark:bg-slate-900'>
            {loadingState?
            <PostSkeleton />
            :
            posts?
            <Posts posts={posts} setPosts={setPosts}/>
            :
            <div className="max-w-2xl m-auto mt-4 bg-white dark:bg-slate-800 dark:text-gray-200 p-4 rounded-lg shadow-md text-center">
                This post is no longer available.
            </div>
            }
        </div>
    )
}