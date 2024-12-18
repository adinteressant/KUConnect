import express from 'express';
import { 
  sendFriendRequest, 
  getFriends, 
  getFriendRequests, 
  acceptFriendRequest, 
  denyFriendRequest 
} from '../controllers/friendsController.js';

import { verifyUser } from '../middlewares/friendsMiddleware.js';

const router = express.Router();

// Route to send a friend request
router.post('/api/send-request', verifyUser, sendFriendRequest);

// Route to fetch friends, incoming, and sent requests
router.get('/api/view-friends', verifyUser, getFriends);
router.get('/api/view-requests', verifyUser, getFriendRequests);

// Route to accept a friend request
router.post('/api/accept-request', verifyUser, acceptFriendRequest);

// Route to deny a friend request
router.post('/api/deny-request', verifyUser, denyFriendRequest);

export default router;
