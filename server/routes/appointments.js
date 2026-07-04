const express = require('express');
const router = express.Router();
const {
  createAppointment, getAppointments, getAppointment,
  updateStatus, deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(authorize('patient'), createAppointment);

router.route('/:id')
  .get(getAppointment)
  .delete(authorize('admin'), deleteAppointment);

router.put('/:id/status', updateStatus);

module.exports = router;
