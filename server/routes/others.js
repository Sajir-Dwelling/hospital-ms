const express = require('express');

// ── Patients ─────────────────────────────────────────────────
const patientRouter = express.Router();
const { getPatients, getMyProfile, updateMyProfile, updateStatus } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

patientRouter.get('/',    protect, authorize('admin', 'doctor'), getPatients);
patientRouter.get('/me',  protect, authorize('patient'), getMyProfile);
patientRouter.put('/me',  protect, authorize('patient'), updateMyProfile);
patientRouter.put('/:id/status', protect, authorize('admin'), updateStatus);

// ── Prescriptions ─────────────────────────────────────────────
const prescriptionRouter = express.Router();
const { createPrescription, getPrescriptions, getPrescription } = require('../controllers/prescriptionController');

prescriptionRouter.use(protect);
prescriptionRouter.get('/',    getPrescriptions);
prescriptionRouter.post('/',   authorize('doctor'), createPrescription);
prescriptionRouter.get('/:id', getPrescription);

// ── Invoices ──────────────────────────────────────────────────
const invoiceRouter = express.Router();
const { getInvoices, createInvoice, markPaid, getSummary } = require('../controllers/invoiceController');

invoiceRouter.use(protect);
invoiceRouter.get('/',         getInvoices);
invoiceRouter.post('/',        authorize('admin'), createInvoice);
invoiceRouter.get('/summary',  authorize('admin'), getSummary);
invoiceRouter.put('/:id/pay',  authorize('admin', 'patient'), markPaid);

// ── Admin ─────────────────────────────────────────────────────
const adminRouter = express.Router();
const { getStats, getUsers, toggleUser } = require('../controllers/adminController');

adminRouter.use(protect, authorize('admin'));
adminRouter.get('/stats',           getStats);
adminRouter.get('/users',           getUsers);
adminRouter.put('/users/:id/toggle', toggleUser);

module.exports = { patientRouter, prescriptionRouter, invoiceRouter, adminRouter };
