const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @route  GET /api/doctors
exports.getDoctors = async (req, res, next) => {
  try {
    const { dept, search } = req.query;
    let filter = {};
    if (dept) filter.department = { $regex: dept, $options: 'i' };

    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone isActive')
      .sort({ rating: -1 });

    let result = doctors;
    if (search) {
      const q = search.toLowerCase();
      result = doctors.filter(d =>
        d.user.name.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/doctors/:id
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone address');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/doctors/me  (doctor's own profile)
exports.getMyProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone address');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/doctors/me
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, phone, address, department, qualification, experience, bio } = req.body;

    // Update user fields
    await User.findByIdAndUpdate(req.user._id, { name, phone, address });

    // Update doctor fields
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { department, qualification, experience, bio },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone address');

    res.json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/doctors/availability
exports.updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true }
    );
    res.json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};
