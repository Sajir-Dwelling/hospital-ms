const Patient = require('../models/Patient');
const User = require('../models/User');

// @route  GET /api/patients  (admin + doctor)
exports.getPatients = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const patients = await Patient.find(filter)
      .populate('user', 'name email phone address')
      .populate({ path: 'assignedDoctor', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });

    let result = patients;
    if (search) {
      const q = search.toLowerCase();
      result = patients.filter(p =>
        p.user.name.toLowerCase().includes(q) ||
        (p.bloodGroup && p.bloodGroup.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/patients/me
exports.getMyProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id })
      .populate('user', 'name email phone address')
      .populate({ path: 'assignedDoctor', populate: { path: 'user', select: 'name' } });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/patients/me
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, phone, address, age, bloodGroup } = req.body;

    await User.findByIdAndUpdate(req.user._id, { name, phone, address });

    const patient = await Patient.findOneAndUpdate(
      { user: req.user._id },
      { age, bloodGroup },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone address');

    res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/patients/:id/status  (admin only)
exports.updateStatus = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('user', 'name email');

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};
