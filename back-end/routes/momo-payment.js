import express from 'express';
import { createPayment, handleIPN } from '../controllers/momo-payment-controller.js';
import authMiddleware from '../middleware/auth-middleware.js';

const router = express.Router();

router.post('/create-payment', authMiddleware, createPayment);
router.post('/ipn', handleIPN);

export default router;