import express from 'express'
import { addComment, updateComment, getComments, likeComment, getCommentLikes, deleteComment } from '../controllers/commentController.js'
import { validateComment, validateUser } from '../middlewares/commentMiddleware.js'

const router = express.Router()

// Add a comment
router.post('/api/post/:postId/user/:userId/add-comment', validateComment, addComment)

// Update a comment
router.post('/api/comment/update-comment', validateComment, validateUser, updateComment)

// Get comments
router.get('/api/post/:postId/user/:userId/get-comments', getComments)

// Like a comment
router.post('/api/comment/:commentId/user/:userId/like-comment', likeComment)

// Get all likes of a comment
router.get('/api/comment/:commentId/get-comment-likes', getCommentLikes)

// Delete a comment
router.post('/api/comment/delete-comment', validateUser, deleteComment)

export default router