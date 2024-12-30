import express from 'express';
import {
  sendFriendRequest,
  getFriends,
  getIncomingFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  denyFriendRequest,
  checkFriendRequestStatus,
  cancelFriendRequest,
} from '../controllers/friendsController.js';
import getProfileByUserId from '../middlewares/friendMiddleware.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';

const router = express.Router();

//Route to check friend request status
router.get('/api/check-status', authenticateJWT, checkFriendRequestStatus);

// Route to send a friend request
router.post('/api/add-friend', authenticateJWT, sendFriendRequest);

//Route to cancel friend request
router.post('/api/cancel-request', authenticateJWT, cancelFriendRequest );

// Route to fetch friends
router.get('/api/view-friends', authenticateJWT, getProfileByUserId, getFriends);

// Route to fetch incoming friend requests with usernames
router.get('/api/view-incoming-requests',authenticateJWT, getProfileByUserId, getIncomingFriendRequests);

// Route to fetch sent friend requests with usernames
router.get('/api/view-sent-requests',authenticateJWT, getProfileByUserId, getSentFriendRequests);

// Route to accept a friend request
router.post('/api/accept-request', authenticateJWT, acceptFriendRequest);

// Route to deny a friend request
router.post('/api/deny-request', authenticateJWT, denyFriendRequest);

export default router;
