import express from 'express'
import { toggleLike, getLikes, userLikedPosts } from '../controllers/likeController.js'

const router = express.Router()

// Get user liked posts data
router.get('/api/users/:userId/get-user-liked-posts-data', userLikedPosts)

// Toggle like on a post
router.post('/api/posts/:postId/users/:userId/toggle-like', toggleLike)

// Get likes for like overlay
router.get('/api/posts/:postId/get-likes', getLikes)

export default router