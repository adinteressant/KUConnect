import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Posts from './Posts'

export default function SpecificPost()
{
    const { postId } = useParams()
    const [posts, setPosts] = useState([])

    useEffect(() =>{
        fetch(`/api/post/${postId}`)
        .then(response => response.json())
        .then(data => setPosts(() => data.post))
        .catch(error => {
            console.error('Error fetching post', error)
        })
    }, [postId])

    return(
        <>
            <Posts posts={posts} setPosts={setPosts}/>
        </>
    )
}