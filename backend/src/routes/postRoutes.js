import express from 'express';
import { createPost, getAllPosts } from '../controllers/postController.js';
import { validatePost } from '../middlewares/postMiddleware.js';

const router = express.Router();

// Route to get all posts
router.get('/api/get-posts', getAllPosts);

// Route to create a new post
router.post('/api/create-post', validatePost, createPost);

export default router;
