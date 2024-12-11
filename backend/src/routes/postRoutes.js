import express from 'express';
import { createPost, getAllPosts } from '../controllers/postController.js';
import { validatePost } from '../middlewares/postMiddleware.js';

const router = express.Router();

// Public route to fetch all posts
router.get('/api/get-posts', getAllPosts);

// Protected route to create a new post with middleware
router.post('/api/create-post', validatePost, createPost);

export default router;
