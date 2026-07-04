const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
};

// @route  POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, department, qualification, experience, age, bloodGroup } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role: role || 'patient', phone });

    // Create role-specific profile
    if (user.role === 'doctor') {
      await Doctor.create({
        user: user._id,
        department: department || 'General',
        qualification: qualification || '',
        experience: experience || '',
        availability: [
          { day: 'Mon', slots: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM'] },
          { day: 'Tue', slots: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM'] },
          { day: 'Wed', slots: ['09:00 AM','10:00 AM','11:00 AM'] },
          { day: 'Thu', slots: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM'] },
          { day: 'Fri', slots: ['09:00 AM','10:00 AM','02:00 PM','03:00 PM'] },
          { day: 'Sat', slots: ['10:00 AM','11:00 AM','12:00 PM'] },
          { day: 'Sun', slots: [] },
        ],
      });
    }

    if (user.role === 'patient') {
      await Patient.create({ user: user._id, age, bloodGroup: bloodGroup || '' });
    }

    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/auth/update-password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
