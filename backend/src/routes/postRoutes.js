//Routes

import express from 'express';
import { createPost, getAllPosts } from '../controllers/postController.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';  // Authentication middleware
import { validatePost } from '../middlewares/postMiddleware.js';  // Validation middleware for post content

const router = express.Router();

// Route to create a new post
router.post('/api/create-post', validatePost, createPost);

// Route to fetch all posts
router.get('/api/fetch-posts', getAllPosts);

export default router;