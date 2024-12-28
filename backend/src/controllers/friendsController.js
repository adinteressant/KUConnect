import FriendRequest from '../models/friendRequest.js';
import PublicInfo from '../models/PublicInfo.js';

/**
 * Send a friend request
 */
export const sendFriendRequest = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  try {
    // Check if the friend request already exists
    const existingRequest = await FriendRequest.findOne({ sender_id, receiver_id });
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent!' });
    }

    // Create a new friend request
    const newRequest = new FriendRequest({ sender_id, receiver_id, status: 'pending' });
    await newRequest.save();

    res.status(201).json({ message: 'Friend request sent successfully!' });
  } catch (error) {
    console.error('Error sending friend request:', error);
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
  const { requestId } = req.body;

  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Set the status of the friend request to 'accepted'
    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.status(200).json({ message: 'Friend request accepted!' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Deny a friend request
 */
export const denyFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Set the status of the friend request to 'denied'
    friendRequest.status = 'denied';
    await friendRequest.save();

    res.status(200).json({ message: 'Friend request denied!' });
  } catch (error) {
    console.error('Error denying friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
