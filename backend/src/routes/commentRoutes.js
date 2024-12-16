import express from 'express'
import { addComment } from '../controllers/commentController.js'
import { validateComment } from '../middlewares/commentMiddleware.js'

const router = express.Router()

// Add a comment to a post
router.post('/api/posts/:postId/users/:userId/add-comment', validateComment, addComment)

export default router