import FriendRequest from '../models/friendRequest.js';
import PublicInfo from '../models/PublicInfo.js';
import { v4 as uuidv4 } from 'uuid'

/**
 * Send a friend request
 */
export const sendFriendRequest = async (req, res) => {
  const { sender_id, receiver_id } = req.body;
  const request_id = uuidv4();


  try {
    // Check if the friend request already exists
    const existingRequest = await FriendRequest.findOne({ sender_id, receiver_id });
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent!' });
    }
    // In sendFriendRequest
const duplicateRequest = await FriendRequest.findOne({
  $or: [
    { sender_id, receiver_id },
    { sender_id: receiver_id, receiver_id: sender_id },
  ],
});
if (duplicateRequest) {
  return res.status(400).json({ message: 'User has sent already sent you a friend request!' });
}

    // Create a new friend request
    const newRequest = new FriendRequest({ sender_id, receiver_id, status: 'pending' , request_id});
    await newRequest.save();

    res.status(201).json({ message: 'Friend request sent successfully!' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check friend request status
export const checkFriendRequestStatus = async (req, res) => {
  const { user1_id, user2_id } = req.query;

  try {
    const request = await FriendRequest.findOne({
      $or: [
        { sender_id: user1_id, receiver_id: user2_id },
        { sender_id: user2_id, receiver_id: user1_id },
      ],
    });

    const incomingRequest = await FriendRequest.findOne(
      { sender_id: user2_id, receiver_id: user1_id, status: 'pending' },
    );

    if (!request) {
      return res.status(200).json({ status: 'none' });
    }
    if(incomingRequest){
      return res.status(200).json({ status: 'incoming' });
    }

    res.status(200).json({ status: request.status, sender_id: request.sender_id, request_id: request.request_id });
    console.log(request.status);
  } catch (error) {
    console.error('Error checking friend request status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Fetch all friends
 */
export const getFriends = async (req, res) => {
  const { user_id } = req.query;

  try {
    // Find all accepted friend requests
    const friends = await FriendRequest.find({
      $or: [{ sender_id: user_id }, { receiver_id: user_id }],
      status: 'accepted',
    });

    // Extract friend IDs
    const friendIds = friends.map((request) =>
      request.sender_id === user_id ? request.receiver_id : request.sender_id
    );

    // Fetch public information of friends
    const friendDetails = await PublicInfo.find({ user_id: { $in: friendIds } });

    // Add usernames to the friend details
    const friendsWithUsernames = friendDetails.map((friend) => ({
      user_id:friend.user_id,     //Include user_id
      username: friend.username, // Include username
      pfp_id: friend.pfp_id,    // Include profile picture ID
    }));

    res.status(200).json({ friends: friendsWithUsernames });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



/**
 * Fetch incoming friend requests with usernames
 */
export const getIncomingFriendRequests = async (req, res) => {
  const { user_id } = req.query;

  try {
    // Find all incoming friend requests
    const incomingRequests = await FriendRequest.find({ receiver_id: user_id, status: 'pending' });
    // Replace user IDs with usernames
    const incomingWithDetails = await Promise.all(
      incomingRequests.map(async (request) => {
        const senderInfo = await PublicInfo.findOne({ user_id: request.sender_id });
        return {
          sender_username: senderInfo?.username || 'Unknown', // Sender's username
          request_id: request.request_id, // Friend request ID
          pfp_id: senderInfo.pfp_id,    // Include profile picture ID
        };
      })
    );

    res.status(200).json({ incoming: incomingWithDetails });
  } catch (error) {
    console.error('Error fetching incoming friend requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Fetch sent friend requests with usernames
 */
export const getSentFriendRequests = async (req, res) => {
  const { user_id } = req.query;

  try {
    // Find all sent friend requests
    const sentRequests = await FriendRequest.find({ sender_id: user_id, status: 'pending' });
    // Replace user IDs with usernames
    const sentWithDetails = await Promise.all(
      sentRequests.map(async (request) => {
        const receiverInfo = await PublicInfo.findOne({ user_id: request.receiver_id });
        return {
          receiver_username: receiverInfo?.username || 'Unknown', // Receiver's username
          request_id: request.request_id, // Friend request ID
          pfp_id: receiverInfo.pfp_id,    // Include profile picture ID
        };
      })
    );

    res.status(200).json({ sent: sentWithDetails });
  } catch (error) {
    console.error('Error fetching sent friend requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (req, res) => {
  const { request_id } = req.body;

  try {
    const friendRequest = await FriendRequest.findOne({ request_id });
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Friend request already processed' });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.status(200).json({ message: 'Friend request accepted!' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Cancel a sent friend request
 */
export const cancelFriendRequest = async (req, res) => {
  const { request_id } = req.body;

  try {
    const friendRequest = await FriendRequest.findOne({ request_id }); 
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Friend request already processed' });
    }

    await FriendRequest.deleteOne({ request_id }); 
    res.status(200).json({ message: 'Friend request canceled!' });
  } catch (error) {
    console.error('Error canceling friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Deny a friend request
 */
export const denyFriendRequest = async (req, res) => {
  const { request_id } = req.body;

  try {
    const friendRequest = await FriendRequest.findOne({ request_id }); 
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Friend request already processed' });
    }
    await FriendRequest.deleteOne({ request_id }); 


    res.status(200).json({ message: 'Friend request denied!' });
  } catch (error) {
    console.error('Error denying friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const acceptFriendRequestfromProfile = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  try {
    // Find the friend request
    const request = await FriendRequest.findOne({ sender_id, receiver_id });

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Mark the request as accepted
    await request.updateOne({ status: 'accepted' });


    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to accept request' });
  }
};

export const denyFriendRequestfromProfile = async (req,res) => {
  const { sender_id, receiver_id } = req.body;

  try {
    // Find the friend request
    const request = await FriendRequest.findOne({ sender_id, receiver_id });

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Remove or mark the request as denied
    await request.deleteOne();

    res.status(200).json({ message: 'Friend request denied' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to deny request' });
  }
};

export const cancelFriendRequestfromProfile = async (req,res) => {
  console.log('Cancel request received:', req.body);

  const { sender_id, receiver_id } = req.body;

  try {
    // Find the friend request
    const request = await FriendRequest.findOne({ sender_id, receiver_id });
    
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Remove or mark the request as cancelled
    await request.deleteOne();

    res.status(200).json({ message: 'Friend request cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel request' });
  }
};