import PublicInfo from '../models/PublicInfo.js';

const getProfileController = async (req, res) => {
  try {
    const { username } = req.query;
    // Fetch public info based on username
    const publicInfo = await PublicInfo.findOne({ username });

    // If no user is found, return an error message
    if (!publicInfo) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send the profile data, including role and pfp_id
    res.json({
      role: publicInfo.role,
      pfp_id: publicInfo.pfp_id,
      msg: 'success',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export default getProfileController;
