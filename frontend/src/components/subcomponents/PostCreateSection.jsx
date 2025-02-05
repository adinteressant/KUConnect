import { useState, useRef, useEffect} from 'react'
import { useOutletContext } from 'react-router-dom'
import base64encode from '../../utils/base64encode.js'
import tags from '../../data/tags.js'
import { Loader2 } from 'lucide-react'
import {Bold, Italic, Strikethrough} from 'lucide-react'

export default function PostCreateSection({ parent ,user, setUser, setPosts, setPostImages, post, close, setTotalPosts }) {
  const [content, setContent] = useState(
    parent==='edit'?post.content:''
  )
  const [showTags, setShowTags] = useState(false)
  const [tagValue, setTagValue] = useState('')
  const [tagList, setTagList] = useState(
    parent==='edit'?post.tags:[]
  )
  const [isTextareaFocused, setIsTextareaFocused] = useState(false)
  const [isTagsInputFocused, setIsTagsInputFocused] = useState(false)
  const [images, setImages] = useState(
    parent==='edit'&&post.images!==null?post.encodedImages:[]
  )
  const [encodedImages, setEncodedImages] = useState(
    parent==='edit'&&post.images!==null?post.encodedImages:[]
  )
  const [showTagDropdown, setShowTagDropdown] = useState(false)

  const [createPostLoadingState, setCreatePostLoadingState] = useState(false)
  const [updatePostLoadingState, setUpdatePostLoadingState] = useState(false)
  const editorRef = useRef(null);

  useEffect(() => {
    if(parent === 'edit' && editorRef.current){
      editorRef.current.innerHTML = post.content
    }
  }, [parent, post]);

  const handleTagRemove = (indexToRemove) => {
      const newTagList = tagList.filter((_, index) => {
        if(index === indexToRemove){
          return false;
        }
        else{
          return true;
        }
      })

      setTagList(newTagList)
  }

  const handleTagSelection = (tag) =>{
    if(!tagList.includes(tag)){
      setTagList([...tagList, tag])
    }
    setShowTagDropdown(false)
    setTagValue('')
  }

  const handleTagInputFocus = () =>{
    setIsTagsInputFocused(true)
    setShowTags(true)
    setShowTagDropdown(true)
  }

  const handleTagInputBlur = () => {
    setIsTagsInputFocused(false)
    setTimeout (() =>{
      if(!content.trim() && !isTextareaFocused && !tagValue.trim()){
        setShowTags(false)
      }
      setShowTagDropdown(false)
    }, 200)
  }

  // Handle Post Submit
  const handlePostSubmit = () => {
    if (!user) {
      alert('You must be logged in to post.')
      return
    }

    if (content.trim()) {
      const userInfo = user

      const formData = new FormData()

      formData.append('content', content)
      formData.append('userInfo', JSON.stringify(userInfo))
      formData.append('tags', JSON.stringify(tagList))
      encodedImages.forEach((image) => {
        formData.append('images', image)
      })

      fetch('/api/create-post', {
        method: 'POST',
        body: formData
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.post) {
          setContent('')
          setTagValue('')
          setTagList([])
          setImages([])
          setEncodedImages([])
          setPosts(prev => [data.post, ...prev])
          setTotalPosts(prev => prev + 1)
          const loggedInUser = data.updatedUsers.find(
            (updatedUser) => updatedUser.user_id === user.user_id
          );
          if (loggedInUser) {
            setUser(loggedInUser.unread_count++);
          }
          setCreatePostLoadingState(() => false)
          //location.reload()
        }
      })
      .catch((error) => {
        console.error('Error submitting post:', error)
      })
    }
    else {
      alert('Post content cannot be empty.')
    }
  }

  const handlePostEdit = () => {
    if(!user) {
      alert('You must be logged in')
      return
    }

    if(content.trim()) {
      const userInfo = user

      const formData = new FormData()

      formData.append('post', JSON.stringify(post))
      formData.append('content', content)
      formData.append('userInfo', JSON.stringify(userInfo))
      formData.append('tags', JSON.stringify(tagList))
      encodedImages.forEach((image) => {
        formData.append('images', image)
      })

      fetch('/api/update-post', {
        method: 'POST',
        body: formData
      })
      .then((response) => response.json())
      .then((data) => {
        setPosts((prev) => 
          prev.map(p =>
            p._id === data.updatedPost._id ? data.updatedPost : p
          )
        )
        const incrementedUsers = data.updatedUsers.incremented
        let loggedInUser = incrementedUsers.find(
          (updatedUser) => updatedUser.user_id === user.user_id
        );
        if (loggedInUser) {
          setUser(loggedInUser.unread_count++);
        }
        const decrementedUsers = data.updatedUsers.decremented
        loggedInUser = decrementedUsers.find(
          (updatedUser) => updatedUser.user_id === user.user_id
          );
          if (loggedInUser) {
            if(loggedInUser.unread_count > 0){
            setUser(loggedInUser.unread_count--)
            }
            else{
              setUser(loggedInUser.unread_count = 0 );
            }
            }
        setPostImages((prev) => {
          const removed = prev.filter(i =>
            i._id !== post.images
          )
          return data.updatedPost.images===null?removed:[...removed, {...data.updatedPostImages, current: 0}]
        })
        close()
        setTimeout(() =>{
          setUpdatePostLoadingState(() => false)
        }, 300)
      })
      .catch((error) => {
        console.error('Error submitting post:', error)
      })
    }
    else {
      alert('Post content cannot be empty.')
    }
  }

  // Handle Tag Input Change
  const handleTagInputChange = (e) => {
    const value = e.target.value
    if (value.endsWith(' ')) {
      const trimmedValue = value.trim()
      if (trimmedValue && !tagList.includes(trimmedValue)) {
        setTagList([...tagList, trimmedValue])
      }
      setTagValue('')
    } else {
      setTagValue(value)
    }
  }

  // Handle Backspace Key for Tag Removal
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Backspace' && !tagValue && tagList.length > 0) {
      const updatedTags = [...tagList]
      updatedTags.pop()
      setTagList(updatedTags)
    }
  }

  const handleTextareaFocus = () => {
    setIsTextareaFocused(true)
    setShowTags(true)
  }

  const handleTextareaBlur = () => {
    setIsTextareaFocused(false)
    if (!content.trim() && !isTagsInputFocused && !tagValue.trim()) {
      setShowTags(false)
    }
  }


  const handleImageChange = async (e) => {
    const selectedImages = Array.from(e.target.files)
    const encodedImageFiles = await base64encode(selectedImages)
    const maxSize = 10 * 1024 * 1024
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (selectedImages.some((image) => image.size > maxSize)) {
      alert('Each image must be less than 10MB')
    }
    else if (selectedImages.some((image) => !validExtensions.includes(image.type))) {
      alert('Each image must be of type jpeg, png, gif or webp')
    }
    else {
      setImages((prev) => {
        const i = [...prev, ...selectedImages.map(i => URL.createObjectURL(i))]
        if (i.length > 10) {
          i.splice(10)
        }
        return i
      })
      setEncodedImages(
        (prev) => {
          const i = [...prev, ...encodedImageFiles]
          if (i.length > 10) {
            i.splice(10)
          }
          return i
        }
      )
    }

    e.target.value = null
  }

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setEncodedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const applyFormatting = (formatType) => {
    
    // Apply the formatting
    document.execCommand('styleWithCSS', false, true);
    switch(formatType) {
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        break;
      case 'strikethrough':
        document.execCommand('strikethrough', false, null);
        break;
      default:
        break;
    }

    // Ensure the editor keeps focus
    editorRef.current.focus();
  };

  const handleChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }

  return (
    <div
      className={`dark:bg-slate-800 bg-white dark:shadow-black p-4 rounded-lg shadow-md transition-all duration-300 h-auto`}
    >
      {updatePostLoadingState?
      <div className='w-full h-full flex justify-center items-center dark:text-gray-200 gap-2'>
        <div>Updating Post...</div>
        <Loader2 className='animate-spin text-cyan-600'/>
      </div>
      :
      (
        createPostLoadingState?
        <div className='w-full h-full flex justify-center items-center dark:text-gray-200 gap-2'>
          <div>Creating Post...</div>
          <Loader2 className='animate-spin text-cyan-600'/>
        </div>
        :
        <>
    
        {/* Formatting Toolbar */}
        <div className="flex gap-2 mb-2">
          <button 
            onClick={() => applyFormatting('bold')}
            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-all duration-300 group/boldbtn"
            title="Bold"
          >
            <Bold size={20} className='stroke-gray-600 dark:stroke-gray-400 group-hover/boldbtn:stroke-cyan-600 transition-all duration-300' />
          </button>
          <button 
            onClick={() => applyFormatting('italic')}
            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-all duration-300 group/italicbtn"
            title="Italic"
          >
            <Italic size={20} className='stroke-gray-600 dark:stroke-gray-400 group-hover/italicbtn:stroke-cyan-600 transition-all duration-300' />
          </button>
          <button 
            onClick={() => applyFormatting('strikethrough')}
            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-all duration-300 group/strikebtn"
            title="Strikethrough"
          >
            <Strikethrough size={20} className='stroke-gray-600 dark:stroke-gray-400 group-hover/strikebtn:stroke-cyan-600 transition-all duration-300' />
          </button>
        </div>

      <div
        placeholder="What's on your mind?"
        ref={editorRef}
        contentEditable
        className={`w-full p-2 border rounded-lg dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all duration-300 ${isTextareaFocused || isTagsInputFocused ? 'h-28' : 'h-20'
        }`}        
        onInput={handleChange}
        onFocus={handleTextareaFocus}
        onBlur={handleTextareaBlur}
        aria-label="Post content"
      />

          <div className={`transition-all duration-500 ease-in-out ${isTextareaFocused || isTagsInputFocused || content.trim() || tagValue.trim() || tagList.length > 0 || images.length > 0 || parent ==='edit' ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            {/*Tag Input Section*/}
            <div className='flex flex-col relative'>
              <input
                type="text"
                placeholder="Add tags (space-separated)"
                className="mt-4 flex-1 p-2 border rounded-lg dark:text-gray-200 dark:bg-slate-900 dark:border-slate-800 bg-gray-100 focus:m-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all duration-300"
                value={tagValue}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                onFocus={handleTagInputFocus}
                onBlur={handleTagInputBlur}
              />

              <div className={`absolute top-full mt-1 w-full bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg z-10 transition-all duration-300 ${showTagDropdown?'max-h-60 overflow-y-auto scrollbar':'max-h-0 overflow-hidden'}`}>
                {tags
                  .filter(tag => (!tagList.includes(tag) && tag.toUpperCase().includes(tagValue.toUpperCase())))
                  .map((tag, index) => (
                    <button
                      key={index}
                      className="text-left w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-gray-200 transition-all duration-300"
                      onClick={() => handleTagSelection(tag)}
                    >
                      {tag}
                    </button>
                  ))}
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {tagList.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-sm"
                    onClick={() => handleTagRemove(index)}
                  >
                    <span>{tag}</span>

                    <svg 
                      className="w-3 h-3 inline-block" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </span>
                ))}
              </div>
            </div>

            {/* Images Upload Section */}
            <div className='mt-4'>
              <input
                type='file'
                accept='image/*'
                multiple
                onChange={(e) => handleImageChange(e)}
                className='hidden'
                id={parent==='edit'?'edit-image-upload':'image-upload'}
              />
              <div className='flex flex-wrap gap-2'>
                {images.map((image, index) => (
                  <div key={index} className='relative'>
                    <img src={image} alt='Preview' className='w-20 h-20 object-cover rounded-lg' />
                    <button onClick={() => handleImageRemove(index)} className='p-0.5 absolute top-0 right-0 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300'>
                      <svg width='12' height='12' viewBox='0 0 24 24'
                        className='stroke-2 stroke-gray-100'
                      >
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>))
                }
                {images.length >= 10 ||
                  (<label
                    htmlFor={parent==='edit'?'edit-image-upload':'image-upload'}
                    className='flex flex-col dark:bg-slate-900 dark:border-slate-700 dark:text-gray-400 items-center justify-center text-center w-20 h-20 rounded-lg text-sm border-dashed border-2 border-gray-400 text-gray-400 hover:text-cyan-600 hover:border-cyan-600 cursor-pointer transition-all duration-300'
                  >
                    Upload Images
                  </label>)
                }
              </div>
            </div>
          </div>
          {parent==='edit'?
          <div className='mt-4 flex justify-end gap-2'>
            <button className='py-2 px-4 rounded-xl dark:text-gray-200 dark:hover:text-gray-300 text-gray-600 hover:text-white dark:bg-slate-700 bg-gray-200 dark:hover:bg-slate-900 hover:bg-gray-400 transition-all duration-300'
              onClick={() => close()}>
              Cancel
            </button>
            <button
              disabled={!content.trim() || (post.content===content&&post.tags===tagList&&(post.images===null?encodedImages.length===0:post.encodedImages===encodedImages))}
              className='py-2 px-4 rounded-xl text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-slate-600 transition-all duration-300'
              onClick={() => {
                handlePostEdit()
                setUpdatePostLoadingState(() => true)
              }}
            >
              Update
            </button>
          </div>
          :
          <button
            disabled={!content.trim()}
            onClick={() => { 
              handlePostSubmit()
              setCreatePostLoadingState(() => true)
            }}
            className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:bg-gray-400 dark:disabled:bg-slate-600 transition-all duration-300"
          >
            Post
          </button>
          }
        </>
      )}
    </div>
  )
}
