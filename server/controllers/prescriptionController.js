const Prescription = require('../models/Prescription');

// @route  POST /api/prescriptions
exports.createPrescription = async (req, res, next) => {
  try {
    const { patient, appointment, diagnosis, medicines, notes } = req.body;

    const prescription = await Prescription.create({
      patient,
      doctor: req.user._id,
      appointment,
      diagnosis,
      medicines,
      notes,
    });

    await prescription.populate([
      { path: 'patient', select: 'name email' },
      { path: 'doctor', select: 'name' },
    ]);

    res.status(201).json({ success: true, data: prescription });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/prescriptions
exports.getPrescriptions = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'patient') query.patient = req.user._id;
    else if (req.user.role === 'doctor') query.doctor = req.user._id;

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/prescriptions/:id
exports.getPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.json({ success: true, data: prescription });
  } catch (err) {
    next(err);
  }
};
