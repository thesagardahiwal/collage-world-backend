import express from 'express';
import { addCurrency, deductCurrency } from '../controllers/currencyController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/currency/add
 * @desc    Add currency to a user's balance
 * @access  Private (Authenticated users)
 */
router.post('/add', isAuthenticated, addCurrency);

/**
 * @route   POST /api/currency/deduct
 * @desc    Deduct currency from a user's balance
 * @access  Private (Authenticated users)
 */
router.post('/deduct', isAuthenticated, deductCurrency);

export default router;
