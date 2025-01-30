import express from 'express'
import { addComment, getComments, deleteComment, addReply, getReplies, deleteReply } from '../controllers/commentController.js'
import { validateComment } from '../middlewares/commentMiddleware.js'

const router = express.Router()

// Add a comment to a post
router.post('/api/post/:postId/parent/:parentId/user/:userId/add-comment', validateComment, addComment)

// Get comments for a post
router.get('/api/post/:postId/get-comments', getComments)

// Get replies for a comment
router.get('/api/comment/:commentId', getReplies)

// // Delete a comment of a post
// router.post('/api/posts/:postId/comments/:commentId/delete-comment', deleteComment)

// // Add a reply to a post
// router.post('/api/posts/:postId/users/:userId/add-a-reply', validateComment, addReply)

// // Get replies for a post
// router.get('/api/comments/:commentId/get-replies', getReplies)

// // Delete a reply for a comment
// router.post('/api/posts/:postId/comments/:commentId/delete-a-reply', deleteReply)

export default router