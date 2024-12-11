import express from 'express';
import { createPost, getAllPosts } from '../controllers/postController.js';
import { validatePost } from '../middlewares/postMiddleware.js';
import authenticateJWT  from '../middlewares/authenticateJWT.js';

const router = express.Router();

// Public route to fetch all posts
router.get('/get-posts', getAllPosts);

// Protected route to create a new post with middleware
router.post('/create-post', authenticateJWT, validatePost, createPost);

export default router;
