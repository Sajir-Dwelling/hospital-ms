const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Invoice = require('../models/Invoice');

// @route  POST /api/appointments
exports.createAppointment = async (req, res, next) => {
  try {
    const { doctor, date, timeSlot, type, reason } = req.body;

    // Check for conflict
    const conflict = await Appointment.findOne({
      doctor,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['Cancelled'] },
    });
    if (conflict) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date: new Date(date),
      timeSlot,
      type: type || 'Consultation',
      reason,
      status: 'Confirmed',
    });

    // Auto-create a pending invoice
    await Invoice.create({
      patient: req.user._id,
      doctor,
      appointment: appointment._id,
      amount: 1500,
      description: `${type || 'Consultation'} Fee`,
      status: 'Pending',
    });

    await appointment.populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'doctor', select: 'name email' },
    ]);

    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/appointments
// Patients see their own; doctors see their schedule; admins see all
exports.getAppointments = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'patient') query.patient = req.user._id;
    else if (req.user.role === 'doctor') query.doctor = req.user._id;
    // admin: no filter

    const { status, date } = req.query;
    if (status) query.status = status;
    if (date) {
      const d = new Date(date);
      query.date = { $gte: d, $lt: new Date(d.getTime() + 86400000) };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email')
      .populate('doctorProfile', 'department')
      .sort({ date: -1, timeSlot: 1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/appointments/:id
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Only involved parties or admin can view
    if (
      req.user.role !== 'admin' &&
      appointment.patient._id.toString() !== req.user._id.toString() &&
      appointment.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/appointments/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Patients can only cancel
    if (req.user.role === 'patient' && status !== 'Cancelled') {
      return res.status(403).json({ success: false, message: 'Patients can only cancel appointments' });
    }

    appointment.status = status;
    await appointment.save();

    // If completed, mark invoice as pending (ready to pay)
    if (status === 'Completed') {
      await Invoice.findOneAndUpdate(
        { appointment: appointment._id },
        { status: 'Pending' }
      );
    }

    res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/appointments/:id  (admin only)
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    next(err);
  }
};
