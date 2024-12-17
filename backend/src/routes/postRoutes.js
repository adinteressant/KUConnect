import express from 'express';
import { createPost, getAllPosts, toggleLike, addComment, sharePost, searchPostsByTag } from '../controllers/postController.js';
import { validatePost, validateComment } from '../middlewares/postMiddleware.js';

const router = express.Router();

// Route to get all posts
router.get('/api/get-posts', getAllPosts);

// Route to create a new post
router.post('/api/create-post', validatePost, createPost);

// Toggle like on a post
router.post('/api/posts/:postId/toggle-like', toggleLike);

// Add a comment to a post
router.post('/api/posts/:postId/add-comment', validateComment, addComment);

// Share a post
router.post('/api/posts/:postId/share', sharePost);

//Search a post by tag
router.get('/api/posts/search', searchPostsByTag);


export default router;
