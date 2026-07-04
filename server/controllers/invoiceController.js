const Invoice = require('../models/Invoice');

// @route  GET /api/invoices
exports.getInvoices = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'patient') query.patient = req.user._id;
    else if (req.user.role === 'doctor') query.doctor = req.user._id;

    const { status } = req.query;
    if (status) query.status = status;

    const invoices = await Invoice.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name')
      .populate('appointment', 'date timeSlot type')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/invoices  (admin only)
exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/invoices/:id/pay
exports.markPaid = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: 'Paid', paidAt: new Date() },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/invoices/summary  (admin only)
exports.getSummary = async (req, res, next) => {
  try {
    const [total, paid, pending, overdue] = await Promise.all([
      Invoice.aggregate([{ $group: { _id: null, sum: { $sum: '$amount' } } }]),
      Invoice.aggregate([{ $match: { status: 'Paid'    } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
      Invoice.aggregate([{ $match: { status: 'Pending' } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
      Invoice.aggregate([{ $match: { status: 'Overdue' } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
    ]);

    res.json({
      success: true,
      data: {
        total:   total[0]?.sum   || 0,
        paid:    paid[0]?.sum    || 0,
        pending: pending[0]?.sum || 0,
        overdue: overdue[0]?.sum || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
