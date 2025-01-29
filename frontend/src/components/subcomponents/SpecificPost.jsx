import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Posts from './Posts'
import PostSkeleton from './PostSkeleton'
import { Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function SpecificPost({ msgPostId }) {
  const postId = msgPostId || useParams().postId
  const [posts, setPosts] = useState([])
  const [loadingState, setLoadingState] = useState(true)

  useEffect(() => {
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

  return (
    <>
      {msgPostId ?
        loadingState ?
          <div className='px-20 py-6 rounded-lg shadow-md bg-white dark:bg-slate-800'>
            <Loader2 className='text-cyan-600 animate-spin'/>
          </div>
          :
          posts ?
              <div className={`text-gray-600 dark:text-white`}>
                <div className='py-2 px-3 border-b border-white dark:border-gray-400 text-sm'>
                  {posts[0].username}'s Post
                </div>
                <div className='py-4 px-2 border-b border-white dark:border-gray-400 text-sm'>
                  <ReactMarkdown>
                    {
                      posts[0].content.length>50?
                        posts[0].content.slice(0,50) + '...'
                        :
                        posts[0].content
                    }
                  </ReactMarkdown>
                </div>
                <div className='flex justify-evenly text-[10px] py-2'>
                  <div className='px-2'>
                    {posts[0].likes + (posts[0].likes===1?' Like':' Likes')}
                  </div>
                  <div className='px-2'>
                  {posts[0].comments + (posts[0].comments===1?' Comment':' Comments')}
                  </div>
                </div>
              </div>
              :
              <div className="p-3 bg-white dark:bg-slate-800 dark:text-gray-200 rounded-lg shadow-md text-center">
                This post is no longer available.
              </div>
        :
        <div className='p-4 pt-0 overflow-y-auto scrollbar h-full bg-gray-200 dark:bg-slate-900'>
          {loadingState ?
            <PostSkeleton />
            :
            posts ?
              <Posts posts={posts} setPosts={setPosts} />
              :
              <div className="max-w-2xl m-auto mt-4 bg-white dark:bg-slate-800 dark:text-gray-200 p-4 rounded-lg shadow-md text-center">
                Post unavailable.
              </div>
          }
        </div>
      }
    </>
  )
}