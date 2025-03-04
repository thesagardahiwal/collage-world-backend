import express from 'express';
import { addCurrency, deductCurrency } from '../controllers/currencyController';

const router = express.Router();

// Route to add currency
router.post('/currency/add', addCurrency);

// Route to deduct currency
router.post('/currency/deduct', deductCurrency);

export default router;