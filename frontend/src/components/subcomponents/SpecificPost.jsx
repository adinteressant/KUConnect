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
            setLoadingState(() => false)
        })
        .catch(error => {
            console.error('Error fetching post', error)
        })
    }, [postId])

    return(
        <div className='p-6'>
            {loadingState?
            <PostSkeleton />
            :
            <Posts posts={posts} setPosts={setPosts}/>
            }
        </div>
    )
}