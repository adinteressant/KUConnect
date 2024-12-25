import express from 'express';
import { 
  sendFriendRequest, 
  getFriends, 
  getFriendRequests, 
  acceptFriendRequest, 
  denyFriendRequest 
} from '../controllers/friendsController.js';

import authenticateJWT from '../middlewares/authenticateJWT.js';

const router = express.Router();

// Route to send a friend request
router.post('/api/add-friend', authenticateJWT, sendFriendRequest);

// Route to fetch friends, incoming, and sent requests
router.get('/api/view-friends', authenticateJWT, getFriends);
router.get('/api/view-requests', authenticateJWT, getFriendRequests);

// Route to accept a friend request
router.post('/api/accept-request', authenticateJWT, acceptFriendRequest);

// Route to deny a friend request
router.post('/api/deny-request', authenticateJWT, denyFriendRequest);

export default router;
