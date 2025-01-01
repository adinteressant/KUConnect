import PublicInfo from '../models/PublicInfo.js';

/**
 * Middleware to fetch public profile information by user_id
 */
const getProfileByUserId = async (req, res, next) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const publicInfo = await PublicInfo.findOne({ user_id });

    if (!publicInfo) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.info = {
      pfp_id: publicInfo.pfp_id,
      username: publicInfo.username,
    };

    next();
  } catch (e) {
    console.error('Error fetching public info:', e);
    return res.status(500).json({ error: e.message });
  }
};

export default getProfileByUserId;
