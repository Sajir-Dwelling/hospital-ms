const express = require('express');
const router = express.Router();
const {
  getDoctors, getDoctor, getMyProfile,
  updateMyProfile, updateAvailability,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/me',           protect, authorize('doctor'), getMyProfile);
router.put('/me',           protect, authorize('doctor'), updateMyProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);
router.get('/:id', getDoctor);

module.exports = router;
