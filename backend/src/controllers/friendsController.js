import FriendRequest from '../models/friendRequest.js';
import PublicInfo from '../models/PublicInfo.js';

export const sendFriendRequest = async (req, res) => {
  const { receiver_id } = req.body;
  const sender_id = req.session?.user?.user_id;
  try {
    const existingRequest = await FriendRequest.findOne({ sender_id, receiver_id });
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent!' });
    }

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
  const { user_id } = req.user;

  try {
    const friends = await FriendRequest.find({
      $or: [{ sender_id: user_id }, { receiver_id: user_id }],
      status: 'accepted',
    });

    const friendIds = friends.map((req) => 
      req.sender_id === user_id ? req.receiver_id : req.sender_id
    );

    const friendDetails = await PublicInfo.find({ user_id: { $in: friendIds } });

    res.status(200).json({ friends: friendDetails });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Fetch incoming and sent friend requests
 */
export const getFriendRequests = async (req, res) => {
  const { user_id } = req.user;

  try {
    const incoming = await FriendRequest.find({ receiver_id: user_id, status: 'pending' });
    const sent = await FriendRequest.find({ sender_id: user_id, status: 'pending' });

    res.status(200).json({ incoming, sent });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
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
  
      friendRequest.status = 'denied';
      await friendRequest.save();
  
      res.status(200).json({ message: 'Friend request denied!' });
    } catch (error) {
      console.error('Error denying friend request:', error);
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
  
      friendRequest.status = 'accepted';
      await friendRequest.save();
  
      res.status(200).json({ message: 'Friend request accepted!' });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
