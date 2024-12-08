import express from 'express';
import { getAllPosts, createPost } from '../controllers/postController';
import authenticateJWT from '../middlewares/authenticateJWT';

const router = express.Router();

// Route to get all posts (authentication is required)
router.get('/all', (req, res) => {
  const { authorizationLine } = req.headers; 
  const user = authenticateJWT(authorizationLine);
  if (user.error) {
    return res.status(401).json({ error: user.error });
  }
  getAllPosts(req, res);
});

// Route to create a post 
router.post('/create', (req, res) => {
  const { authorizationLine } = req.headers; 
  const user = authenticateJWT(authorizationLine);
  if (user.error) {
    return res.status(401).json({ error: user.error });
  }
  req.user = user; 
  createPost(req, res);
});

export default router;
