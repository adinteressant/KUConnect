import express from 'express'
import { savePost, getSavedStatus, getSavedPosts } from '../controllers/savePostController.js'

const router = express.Router()

//Save the Post
router.post('/api/save/post/:postId/user/:userId', savePost)

//Get the saved status
router.get('/api/save/get-status/post/:postId/user/:userId', getSavedStatus)

//Get all the saved posts
router.get('/api/save/get-posts/user/:userId', getSavedPosts)

export default router