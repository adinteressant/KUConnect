import { React, useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import formatTimeAgo from '../../utils/generateTimeAgo.js'
import ShowLikes from './LikeOverlay.jsx'
import ShowComments from './CommentOverlay.jsx'
import { useOutletContext } from 'react-router-dom'
//Props include:
//Posts (array) jun dekhauna parney cha
//Also send the setPosts function for state variable posts

function Posts(props) {

    const {userProfile, setUserProfile} = useOutletContext()
    const [posts, setPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [liked, setLiked] = useState('false')
    const [showLikeOverlay, setShowLikeOverlay] = useState('')
    const [showCommentBox, setShowCommentBox] = useState([])
    const [showCommentOverlay, setShowCommentOverlay] = useState('')
    const [overlayTransitionState, setOverlayTransitionState] = useState(false)
    const [postOptions, setPostOptions] = useState('')
    const [confirmDeletePost, setConfirmDeletePost] = useState(false)
    const [displayImage, setDisplayImage] = useState([])
    const [viewImage, setViewImage] = useState(false)

    useEffect(() => {
      fetch('/api/get-user-profile')
        .then((response) => response.json())
        .then((data) => {
          setUserProfile(data)
        })
        .catch((e) => {
          console.error('Error fetching user profile:', e)
        })
    }, [])

    //For separate comments and images for separate posts
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
      
      const displayImageArray = props.posts.map((p) => {
        const alreadyObjExists = displayImage.find((i) => i.postId === p._id)
        if(alreadyObjExists)
        {
          return alreadyObjExists
        }
        else
        {  
          return {
            postId: p._id,
            image: p.images[0] || '',
            num: 0
          }
        }
      })
      setDisplayImage(() => displayImageArray)

    }, [props.posts])

    //Fetch user liked posts data
    useEffect(() => {
        fetch(`/api/users/${userProfile.user_id}/get-user-liked-posts-data`)
        .then((response) => response.json())
        .then((data) => {
            setLikedPosts(() => data.likedPosts)
        })
        .catch((e) => {
            console.error('Error fetching liked posts:', e)
        })
    }, [userProfile, liked])

    //Handle like in post
    const handleLike = async(post) => {
        if (!userProfile) {
            alert('You must be logged in to like the post.')
            return
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
        alert('You must be logged in to comment on the post.')
        return
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

    const prevImage = (post) => {
      setDisplayImage((prev) => prev.map((i) => {
        if(i.postId === post._id)
        {
          return {...i, image:post.images[i.num-1], num:i.num-1}
        }
        else
        {
          return i
        }
      }))
    }

    const nextImage = (post) => {
      setDisplayImage((prev) => prev.map((i) => {
        if(i.postId === post._id)
        {
          return {...i, image:post.images[i.num+1], num:i.num+1}
        }
        else
        {
          return i
        }
      }))
    }

    const openImageOverlay = (postId, image) => {
      const obj = {postId, image}
      setViewImage(() => obj)
      setTimeout(() => {
          setOverlayTransitionState(true)
      }, 1)
      document.body.classList.toggle('overflow-hidden', true)
    }

    const closeImageOverlay = () => {
      setTimeout(() => {
        setViewImage(() => false)
      }, 300)
      setOverlayTransitionState(false)
      document.body.classList.toggle('overflow-hidden', false)
    }

    const openConfirmDeletePost = (post) =>
    {
      setConfirmDeletePost(() => post)
      setTimeout(() => {
          setOverlayTransitionState(true)
      }, 1)
      document.body.classList.toggle('overflow-hidden', true)
    }

    const closeConfirmDeletePost = () =>
    {
      setTimeout(() => {
        setConfirmDeletePost(() => false)
      }, 300)
      setOverlayTransitionState(false)
      document.body.classList.toggle('overflow-hidden', false)
    }

    const deletePost = async(post) =>
    {
      try
      {
        const response = await fetch(`/api/post/user/${userProfile.user_id}/delete-post`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            post
          })
        })

        const deletedPost = await response.json()

        if(response.ok)
        {
          props.setPosts((prevPosts) =>
            prevPosts.filter((p) =>
              p._id !== deletedPost.deletedPost._id
            )
          )
          setPosts((prevPosts) =>
            prevPosts.filter((p) =>
              p._id !== deletedPost.deletedPost._id
            )
          )
          console.log(deletedPost+ "Unread Count!:"+userProfile.unread_count)
          deletedPost.deletedPost.tags.forEach(e => {
            if (userProfile.tags.includes(e) && userProfile.unread_count>0){
              userProfile.unread_count--
              return
            } 
          })
        }
        else
        {
          console.error('Error deleting post:', deletedPost.message)
        }
      }
      catch(error)
      {
        console.error('Error deleting post:', error)
      }
    }

    return(

        <div>
          <div className='max-w-2xl mx-auto space-y-4'>
            <div className="mt-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className={`group/post relative bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-300 ${
                    post.isUpdating ? 'scale-105' : 'scale-100'
                  }`}
                >
                  <div className='flex gap-2 items-center'>
                    <Link to={`/${post.username}`}>
                      <img src={`/api/get-pfp?id=${post.pfp_id}`} className="h-9 w-9 rounded-full object-cover"/>
                    </Link>
                    <div>
                      <Link to={`/${post.username}`}
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

                  {/* Display Images */}
                  {post.images.length > 0 &&
                    <div className='mt-2 relative group/image'>
                      
                      <img 
                        onClick={() => openImageOverlay(post._id.toString(), displayImage.find(i => i.postId === post._id).image)} 
                        src={`/api/post/${post._id.toString()}/${displayImage.find(i => i.postId === post._id).image}`}
                        className='rounded-lg cursor-pointer min-w-[100%] max-h-[500px] object-cover'
                      />
                      
                      {post.images.length > 1 &&
                      (<div className='absolute bottom-0 w-full h-12 bg-black bg-opacity-40 opacity-0 rounded-b-lg flex justify-center items-center group-hover/image:opacity-80 transition-all duration-300'>
                        
                        <button 
                          disabled={displayImage.find(i => i.postId === post._id).num===0}
                          onClick={() => prevImage(post)}
                          className='disabled:opacity-0'
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24"
                            className='fill-none stroke-2 stroke-white hover:stroke-cyan-600 transition-all duration-300'
                          >
                            <path d="m15 18-6-6 6-6"/>
                          </svg>
                        </button>
                        
                        <div className='text-white text-sm'>
                          {displayImage.find(i => i.postId === post._id).num+1} / {post.images.length}
                        </div>
                        
                        <button 
                          disabled={displayImage.find(i => i.postId === post._id).num===(post.images.length-1)}
                          onClick={() => nextImage(post)}
                          className='disabled:opacity-0'
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24"
                            className='fill-none stroke-2 stroke-white hover:stroke-cyan-600 transition-all duration-300'
                          >
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                        </button>

                      </div>)}

                    </div> 
                  }

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
                          <Link className='mt-2 shrink-0' to={`/${userProfile.username}`}>
                            <img src={`/api/get-pfp?id=${d.pfp}`} alt="profile" className="w-8 h-8 rounded-full object-cover"/>
                          </Link>
                          <div className='ml-2'>
                              <div className='bg-gray-100 p-2 rounded-xl'>
                                <div className='flex gap-2 items-center'>
                                  <Link to={`/${userProfile.username}`} className='text-gray-800 font-semibold text-sm'>
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

                  {/* Post Options */}
                  <div className='absolute top-3 right-3 flex flex-col items-end' onMouseLeave={() => setPostOptions(() => '')}>
                    <button className='opacity-0 group-hover/post:opacity-100 rounded-full p-1 transition-all duration-300 hover:bg-gray-100' onClick={() => setPostOptions((prev) => (prev===post._id)?'':post._id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" 
                        className = 'stroke-1 stroke-gray-600'>
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </button>
                    
                    <div className={`rounded-lg shadow-2xl bg-gray-100 transition-all duration-300 overflow-hidden ${postOptions === post._id?'opacity-100 max-h-screen':'opacity-0 max-h-0'}`}>  
                      {useParams().postId===post._id ||
                      (<div>
                        <Link
                          to={`/post/${post._id}`}
                          className={`w-[100%] group/view flex items-center gap-2 rounded-t-lg p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-200 hover:shadow-inner transition-all duration-300`}
                        >
                          <svg className='stroke-gray-600 fill-none stroke-2 group-hover/view:stroke-cyan-600 transition-all duration-300' width="20" height="20" viewBox="0 0 24 24">
                            <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                            <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                            <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                            <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                            <circle cx="12" cy="12" r="1"/>
                            <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/>
                          </svg>
                          <div>View</div>
                        </Link>
                      
                        <hr/>
                      </div>)}

                      <button
                        disabled={postOptions!==post._id}
                        // onClick={() => }
                        className={`w-[100%] group/save flex items-center gap-2 p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-200 hover:shadow-inner transition-all duration-300
                          ${post.userId !== userProfile.user_id?'rounded-b-lg':''}
                          ${useParams().postId?'rounded-t-lg':''}
                        `}
                      >
                        <svg className='stroke-gray-600 fill-none stroke-2 group-hover/save:stroke-cyan-600 transition-all duration-300' width="20" height="20" viewBox="0 0 24 24">
                          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                        </svg>
                        <div>Save</div>
                      </button>
                      
                      {(post.userId === userProfile.user_id) &&
                      <div>
                        <hr/>

                        <button
                          disabled={postOptions!==post._id}
                          // onClick={() => }
                          className={`w-[100%] group/edit flex items-center gap-2 p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-200 hover:shadow-inner transition-all duration-300`}
                        >
                          <svg className='stroke-gray-600 fill-none stroke-2 group-hover/edit:stroke-cyan-600 transition-all duration-300' width="20" height="20" viewBox="0 0 24 24">
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                          </svg>
                          <div>Edit</div>
                        </button>

                        <hr/>
                      
                        <button
                          disabled={postOptions!==post._id}
                          onClick={() => openConfirmDeletePost(post)} 
                          className={`w-[100%] group/del flex items-center gap-2 rounded-b-lg p-2 text-red-600 hover:text-red-700 hover:bg-gray-200 hover:shadow-inner transition-all duration-300`}
                        >
                          <svg className='stroke-red-600 fill-none stroke-2 group-hover/del:stroke-red-700 transition-all duration-300' width="20" height="20" viewBox="0 0 24 24">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                          <div>Delete</div>
                        </button>
                      </div>}
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

          {/* Confirmation for deleting post */}
          {confirmDeletePost && 
          (<div className={`fixed inset-0 z-50
                          flex items-center justify-center
                          bg-black transition-all duration-300
                          ${overlayTransitionState?'bg-opacity-50':'bg-opacity-0'}
                          `}
          >
            <div className={`bg-white min-w-[320px] w-[40%] max-w-[580px] min-h-36 max-h-[400px] rounded-xl shadow-2xl
                  transition-all duration-300
                  ${overlayTransitionState?'opacity-100 scale-100':'opacity-0 scale-50'}
                  flex flex-col justify-evenly p-2`}
            >
              <div className='m-3 mb-2 text-lg font-semibold'>
                Delete Post
              </div>
              <hr/>
              <div className='m-3 my-2'>
                Once deleted, this post cannot be restored. Are you sure you want to delete it permanently?
              </div>
              <div className='flex justify-end gap-2 m-2'>
                <button className='py-2 px-4 rounded-xl text-gray-600 hover:text-white bg-gray-200 hover:bg-gray-400'
                  onClick={() => closeConfirmDeletePost()}>
                  Cancel
                </button>
                <button className='py-2 px-4 rounded-xl text-white bg-red-600 hover:bg-red-700'
                  onClick={() => {
                    deletePost(confirmDeletePost)
                    closeConfirmDeletePost()
                  }}>
                  Delete
                </button>
              </div>
            </div>
          </div>)}

          {/* Image Overlay */}
          {viewImage &&
          (<div className={`fixed inset-0 z-50
              flex items-center justify-center
              bg-black transition-all duration-300
              ${overlayTransitionState?'bg-opacity-50':'bg-opacity-0'}
              `}      
              onClick={closeImageOverlay}
          >
            <img src={`/api/post/${viewImage.postId}/${viewImage.image}`}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-[80%] max-h-[80%]
                  rounded-lg shadow-2xl
                  transition-all duration-300
                  ${overlayTransitionState?'opacity-100 scale-100':'opacity-0 scale-50'}
                  `}
            />
            <button className={`absolute right-4 top-4 p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 ${overlayTransitionState?'opacity-100 scale-100':'opacity-0 scale-50'}`}>
              <svg width='20' height='20' viewBox='0 0 24 24'
                    className='stroke-gray-100 fill-none'
              >
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>)}

          {/* Like Overlay */}
          {showLikeOverlay &&
              (<div className={`fixed inset-0 z-50
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
                  <ShowLikes postId={showLikeOverlay} userProfile = {userProfile} closeLikeOverlay={closeLikeOverlay}/>
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
                  <ShowComments postId={showCommentOverlay} userProfile= {userProfile} closeCommentOverlay={closeCommentOverlay}/>
                </div>
              </div>
            )}
        </div>
    )
}

export default Posts
