import express from 'express'
import { createPost, updatePost, getAllPosts, getImages,  sharePost, searchPostsByTag, userPosts, getSpecificPost,  searchPostsByContent, deletePost } from '../controllers/postController.js'
import { upload, validatePost, validateUser, validatePostDeletion } from '../middlewares/postMiddleware.js'
// import generateFolderName from '../utils/generateFolderName.js'

const router = express.Router()

// Route to get all posts
router.get('/api/get-posts', getAllPosts)

// Route to create a new post
router.post('/api/create-post', upload, validatePost, createPost)

// Route to update post
router.post('/api/create-post', upload, validatePost, validateUser, updatePost)

// Route to get post images
router.get('/api/post/images/:imageId', getImages)

// Share a post
router.post('/api/posts/:postId/share', sharePost)

//Search a post by content
router.get('/api/posts/search/content', searchPostsByContent)

// Search a post by tags
router.get('/api/posts/search/tag', searchPostsByTag)

//To get specific post
router.get('/api/post/:postId', getSpecificPost)

//To get posts of specific user
router.get('/api/posts/user/:userId/get-user-posts', userPosts)

// Delete a post
router.post('/api/post/user/:userId/delete-post', validatePostDeletion, deletePost)

export default router
