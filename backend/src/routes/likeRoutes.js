import express from 'express'
import { toggleLike, getLikes } from '../controllers/likeController.js'

const router = express.Router()

// Toggle like on a post
router.post('/api/posts/:postId/users/:userId/toggle-like', toggleLike)

// Get likes for like overlay
router.get('/api/posts/:postId/get-likes', getLikes)

export default router