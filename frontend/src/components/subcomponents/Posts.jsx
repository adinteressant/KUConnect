import { React, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import formatTimeAgo from '../../utils/generateTimeAgo.js'
import ShowLikes from './LikeOverlay.jsx'
import ShowComments from './CommentOverlay.jsx'

//Props include:
//Posts (array) jun dekhauna parney cha
//Also send the setPosts function for state variable posts
function Posts(props) {

    const [userProfile, setUserProfile] = useState({})
    const [posts, setPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [liked, setLiked] = useState('false')
    const [showLikeOverlay, setShowLikeOverlay] = useState('')
    const [showCommentBox, setShowCommentBox] = useState([])
    const [showCommentOverlay, setShowCommentOverlay] = useState('')
    const [overlayTransitionState, setOverlayTransitionState] = useState(false)

    useEffect(() => {
      fetch('/api/get-user-profile')
        .then((response) => response.json())
        .then((data) => {
          setUserProfile(data);
        })
        .catch((e) => {
          console.error('Error fetching user profile:', e);
        });
    }, []);

    //For separate comments for separate posts
    useEffect(() => {
      setPosts(() => props.posts)
      const updatedArray = props.posts.map((p) => {
          const alreadyExists = showCommentBox.find((c) => c.postId === p._id)
          if(alreadyExists)
          {
            return alreadyExists
          }
          else
          {
            return {postId: p._id, value: false, content: '', display: []}
          }
      })
      setShowCommentBox(() => updatedArray)
    }, [props.posts])

    //Fetch user liked posts data
    useEffect(() => {
        fetch(`/api/users/${userProfile.user_id}/get-user-liked-posts-data`)
        .then((response) => response.json())
        .then((data) => {
            setLikedPosts(() => data.likedPosts)
        })
        .catch((e) => {
            console.error('Error fetching liked posts:', e);
        });
    }, [userProfile, liked])

    //Handle like in post
    const handleLike = async(post) => {
        if (!userProfile) {
            alert('You must be logged in to like the post.');
            return;
        }
    
        try {
            const response = await fetch(`/api/posts/${post._id.toString()}/users/${userProfile.user_id.toString()}/toggle-like`, {
                method: 'POST'
            })

            const updatedPost = await response.json()
            if(response.ok)
            {
                setLiked((prev) => !prev)

                props.setPosts((prevPosts) => 
                    prevPosts.map((p) =>
                        p._id === updatedPost.post._id ? { ...updatedPost.post, isUpdating: true } : p
                    )
                )

               setPosts((prevPosts) => 
                  prevPosts.map((p) =>
                      p._id === updatedPost.post._id ? { ...updatedPost.post, isUpdating: true } : p
                  )
              )
            
                // Reset the isUpdating state after animation
                setTimeout(() => {
                    setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                            p._id === updatedPost.post._id ? { ...p, isUpdating: false } : p
                        )
                    )
                    props.setPosts((prevPosts) => 
                      prevPosts.map((p) =>
                          p._id === updatedPost.post._id ? { ...updatedPost.post, isUpdating: false } : p
                      )
                  )
                }, 300) // Match this with the animation duration
            }
            else
            {
                console.error('Error liking post:', updatedPost.message)
            }
        }
        catch(error) {
        console.error('Error toggling like:', error)
        }
    }

    const isLiked = (post) => {
        return likedPosts.some((p) => p.postId === post._id)
    }

    const isInfoDisplayed = (post) => {
        return (post.likes>0||post.comments>0||post.shares.length>0)
    }
    
    const toggleCommentBox = (post) => {
        setShowCommentBox((prevArray) => {
                return prevArray.map((p) => {
                    return p.postId===post._id ? {...p, value: !p.value} : p
            })
        })
    }

    const handleNewComment = async(post) =>
    {
        if (!userProfile) {
        alert('You must be logged in to comment on the post.');
        return;
        }
        
        try {
        const response = await fetch(`/api/posts/${post._id.toString()}/users/${userProfile.user_id.toString()}/add-comment`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            content: showCommentBox.find(p => p.postId === post._id).content
            })
        })
    
        const updatedPost = await response.json()
        if(response.ok)
        {
            setShowCommentBox((prev) => 
            prev.map((p) => p.postId===post._id? {...p, content: '', display: p.display.concat({
                pfp: updatedPost.pfp,
                username: updatedPost.username,
                role: updatedPost.role,
                comment: updatedPost.comment,
                created: updatedPost.created
            })} : p
            ))
            props.setPosts((prevPosts) =>
              prevPosts.map((p) =>
                  p._id === updatedPost.post._id ? { ...updatedPost.post, isUpdating: true } : p
              ))
            setPosts((prevPosts) =>
            prevPosts.map((p) =>
                p._id === updatedPost.post._id ? { ...updatedPost.post, isUpdating: true } : p
            )
            )
            setTimeout(() => {

              props.setPosts((prevPosts) =>
                prevPosts.map((p) =>
                p._id === updatedPost.post._id ? { ...p, isUpdating: false } : p
                )
            )
              
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                p._id === updatedPost.post._id ? { ...p, isUpdating: false } : p
                )
            )
            }, 300)
        }
        else
        {
            console.error('Error commenting on the post:', updatedPost.message)
        }
        }
        catch(error) {
        console.error('Error commenting on the post:', error)
        }
    }

    const openLikeOverlay = (postId) =>
    {
        setShowLikeOverlay(() => postId)
        document.body.classList.toggle('overflow-hidden', true)
        setTimeout(() => {
            setOverlayTransitionState(true)
        }, 1)
    }
      
    const closeLikeOverlay = () =>
    {
        setTimeout(() => {
            setShowLikeOverlay(() => '')
        }, 300)
        setOverlayTransitionState(false)
        document.body.classList.toggle('overflow-hidden', false)
    }
      
    const openCommentOverlay = (postId) =>
    {
        setShowCommentOverlay(() => postId)
        document.body.classList.toggle('overflow-hidden', true)
        setTimeout(() => {
            setOverlayTransitionState(true)
        }, 1)
    }
    
    const closeCommentOverlay = () =>
    {
        setTimeout(() => {
            setShowCommentOverlay(() => '')
        }, 300)
        setOverlayTransitionState(false)
        document.body.classList.toggle('overflow-hidden', false)
    }      

    return(

        <div>
          <div className='max-w-2xl mx-auto space-y-4'>
            <div className="mt-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className={`bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-300 ${
                    post.isUpdating ? 'scale-105' : 'scale-100'
                  }`}
                >
                <div className='flex gap-2 items-end'>
                  <Link to={post.username != userProfile.username ?`/${post.username}`:
                `/myprofile`}>
                    <img src={`/api/get-pfp?id=${post.pfp_id}`} className="h-9 w-9 rounded-full object-cover"/>
                  </Link>
                  <div>
                    <Link to={post.username != userProfile.username ?`/${post.username}`:
                `/myprofile`} 
                      className="text-gray-800 font-semibold">
                      {post.username}
                    </Link>
                    <div className='flex gap-1 items-center text-gray-600 text-xs'>
                      <div>
                        {post.role.charAt(0).toUpperCase() + post.role.slice(1)}
                      </div>
                      &#183;
                      <div>
                        {formatTimeAgo(post.createdAt)} ago
                        {/*new Date(post.createdAt).toLocaleDateString('en-US', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}, {new Date(post.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })*/}
                      </div>
                    </div>
                  </div>
                </div>
                  <p className="mt-2 text-gray-800">{post.content}</p>
                  {post.tags.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Tags: {post.tags.join(', ')}
                    </div>
                  )}

                  <hr className='absolute left-0 right-0 mt-4'/>
                  
                  {/* Likes, Comments, Shares Information */}
                  <div className={`mt-6 flex items-center gap-4 transition-all duration-300 ${isInfoDisplayed(post)?'opacity-100 h-max-screen':'opacity-0 h-max-0'}`}>
                    {/* like information */}
                      {post.likes>0 &&
                        <button 
                          onClick={() => openLikeOverlay(post._id)} 
                          className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-300"
                        >  
                          {(post.likes<3
                            ? `Liked by ${post.recentLikes.join(' and ')}`
                            : `Liked by ${post.recentLikes.join(', ')} and ${post.likes-2} more`
                          )}
                        </button>
                      }

                    <div className='ml-auto flex items-center gap-4'>
                      
                        {/* comment information */}
                        {post.comments>0 &&
                          <button onClick={() => openCommentOverlay(post._id)} className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-300">  
                            {post.comments} comments
                          </button>
                        }

                        {/* share information */}
                        {post.shares.length>0 &&
                          <button className="text-sm text-gray-600 hover:text-cyan-600 transition-all duration-300">  
                            {post.shares.length} shares
                          </button>
                        }
                    </div>
                  </div>

                  <hr className={`transition-all duration-300 ${isInfoDisplayed(post)?'opacity-100 h-max-screen mt-2':'opacity-0 h-max-0 mt-0'}`}/>

                  {/* Like, Comment, Share Button */}
                  <div className={`transition-all duration-1000 flex justify-evenly items-center gap-2 ${(!isInfoDisplayed(post)&&showCommentBox.find(obj => obj.postId===post._id).value)?'mt-0':'mt-2'}`}>

                    {/* like button */}
                    <button onClick = {() => handleLike(post)} className = 'flex justify-center items-center gap-2 group'>
                      <svg width='24' height='24' viewBox='0 0 24 24'
                      className= {`transition-all duration-300 ${isLiked(post)
                        ? 'stroke-cyan-600 fill-cyan-600 group-hover:fill-cyan-700 group-hover:stroke-cyan-700'
                        : 'stroke-gray-600 fill-none group-hover:stroke-cyan-600'}`}
                      xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/>
                      </svg>
                      
                      <span className = {`transition-all duration-300
                          ${isLiked(post)
                          ? 'text-cyan-600 group-hover:text-cyan-700'
                          : 'text-gray-600 group-hover:text-cyan-600'
                      }`}>
                        {isLiked(post)
                        ? 'Liked' 
                        : 'Like'
                        }
                      </span>
                    </button>

                    {/* comment button */}
                    <button onClick={() => toggleCommentBox(post)} className='flex justify-center items-center gap-2 group'>
                      <svg width='24' height='24' viewBox='0 0 24 24'
                        className = {`transition-all duration-300 fill-none
                          ${showCommentBox.find(obj => obj.postId===post._id).value
                          ? 'stroke-cyan-600 group-hover:stroke-cyan-700'
                          : 'stroke-gray-600 group-hover:stroke-cyan-600'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                      </svg>

                      <span className = {`transition-all duration-300
                          ${showCommentBox.find(obj => obj.postId===post._id).value
                          ? 'text-cyan-600 group-hover:text-cyan-700'
                          : 'text-gray-600 group-hover:text-cyan-600'
                        }`}>
                        Comment
                      </span>
                    </button>

                    {/* share button */}
                    <button className='flex justify-center items-center gap-2 group'>
                      <svg width='24' height='24' viewBox='0 0 24 24'
                        className='stroke-gray-600 fill-none group-hover:stroke-cyan-600 transition-all duration-300'
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                        <path d="m21.854 2.147-10.94 10.939"/>
                      </svg>

                      <span className='text-gray-600 group-hover:text-cyan-600 transition-all duration-300'>
                        Share
                      </span>
                    </button>
                  </div>

                  {/* comment button thichda dekhauney */}
                  <div className={`transition-all duration-1000 overflow-y-auto ease-in-out ${showCommentBox.find(obj => obj.postId===post._id).value? 'opacity-100 max-h-screen mt-2' : 'opacity-0 max-h-0 mt-0'}`}>
                    <hr className='absolute left-0 right-0'/>

                    {/* Bhakhar gareko comment bhayo hai bhanera display garna ko lagi (ani overall comments chai paxi xuttai overlay maa dekhauney) */}
                    <div className={`transition-all duration-300 ease-in-out flex flex-col`}>
                      
                      {showCommentBox.find(p => p.postId === post._id).display.map((d, index) => 
                        <div key={index} className='flex mt-4'>
                          <Link className='mt-2 shrink-0' to={post.username != userProfile.username ?`/${post.username}`:
                `/myprofile`}>
                            <img src={`/api/get-pfp?id=${d.pfp}`} alt="profile" className="w-8 h-8 rounded-full object-cover"/>
                          </Link>
                          <div className='ml-2'>
                              <div className='bg-gray-100 p-2 rounded-xl'>
                                <div className='flex gap-2 items-center'>
                                  <Link to={post.username != userProfile.username ?`/${post.username}`:
                `/myprofile`} className='text-gray-800 font-semibold text-sm'>
                                    {d.username}
                                  </Link>
                                  <div className='text-gray-600 text-xs'>
                                    {d.role.charAt(0).toUpperCase() + d.role.slice(1)}
                                  </div>
                                </div>
                                <div className='text-gray-800 break-all whitespace-normal'>
                                  {d.comment}
                                </div>
                              </div>
                            <div className='flex items-center gap-4 ml-2 text-gray-600 text-xs'>
                              {formatTimeAgo(d.created)} ago
                            </div>                      
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Comment Input Section */}
                    <div className='mt-4 flex flex-col gap-2'>
                      <div className='flex'>
                        <textarea
                          onChange={(e) => 
                            setShowCommentBox((prev) => 
                              prev.map((p) => p.postId===post._id? {...p, content: e.target.value} : {...p}
                              ))
                          }
                          value={showCommentBox.find(obj => obj.postId===post._id).content}
                          placeholder="Add a comment..."
                          className='flex-1 transition-all duration-300 p-2 border rounded-lg bg-gray-100 focus:m-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-1
                                    resize-none overflow-auto leading-6'
                          rows='2'
                        />
                      </div>
                      <button
                        disabled={!showCommentBox.find(obj => obj.postId===post._id).content.trim()}
                        onClick={() => handleNewComment(post)}
                        className="transition-all duration-300
                        mr-auto bg-cyan-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400
                        hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 focus:ml-1 focus:mb-1 focus:mt-1"
                        
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                No posts available.
              </div>
            )}
            </div>
          </div>
          {/* Like Overlay */}
          {showLikeOverlay &&
              (<div className={`w-screen h-screen fixed inset-0 z-50
                            flex items-center justify-center
                            bg-black transition-all duration-300
                            ${overlayTransitionState?'bg-opacity-50':'bg-opacity-0'}
                            `}      
                            onClick={closeLikeOverlay}
              >
                <div onClick={(e) => e.stopPropagation()} 
                    className={`relative bg-white w-80 h-96 rounded-lg shadow-2xl
                      transition-all duration-300
                      ${overlayTransitionState?'opacity-100 scale-100':'opacity-0 scale-50'}
                      `}
                >
                  <button onClick={closeLikeOverlay} className='absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-all duration-300'>
                    <svg width='24' height='24' viewBox='0 0 24 24'
                      className='stroke-gray-600 fill-none'
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                  <ShowLikes postId={showLikeOverlay} closeLikeOverlay={closeLikeOverlay}/>
                </div>
              </div>
            )}

            {/* Comment Overlay */}
            {showCommentOverlay &&
              (<div className={`fixed inset-0 z-50
                            flex items-center justify-center
                            bg-black transition-all duration-300
                            ${overlayTransitionState?'bg-opacity-50':'bg-opacity-0'}
                            `}      
                            onClick={closeCommentOverlay}
              >
                <div onClick={(e) => e.stopPropagation()} 
                    className={`relative bg-white min-w-80 w-[50%] h-[60%] rounded-lg shadow-2xl
                      transition-all duration-300
                      ${overlayTransitionState?'opacity-100 scale-100':'opacity-0 scale-50'}
                      `}
                >
                  <button onClick={closeCommentOverlay} className='absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-all duration-300'>
                    <svg width='24' height='24' viewBox='0 0 24 24'
                      className='stroke-gray-600 fill-none'
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                    </svg>
                  </button>
                  <ShowComments postId={showCommentOverlay} closeCommentOverlay={closeCommentOverlay}/>
                </div>
              </div>
            )}
        </div>
    );
}

export default Posts