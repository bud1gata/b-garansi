const User = require('../models/User');

// @desc      Get all users
// @route     GET /api/admin/users
// @access    Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Return all users except the admin, or just all users
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc      Approve a user
// @route     PUT /api/admin/users/:id/approve
// @access    Private/Admin
exports.approveUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
