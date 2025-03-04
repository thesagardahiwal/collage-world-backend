"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deductCurrency = exports.addCurrency = void 0;
const user_1 = __importDefault(require("../models/user"));
// Add currency to a user
const addCurrency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    if (amount <= 0)
        return res.status(400).json({ message: 'Invalid amount' });
    try {
        const user = yield user_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        user.inAppCurrency += amount;
        yield user.save();
        res.status(200).json({ message: 'Currency added successfully', inAppCurrency: user.inAppCurrency });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addCurrency = addCurrency;
// Deduct currency from a user
const deductCurrency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    if (amount <= 0)
        return res.status(400).json({ message: 'Invalid amount' });
    try {
        const user = yield user_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (user.inAppCurrency < amount)
            return res.status(400).json({ message: 'Insufficient funds' });
        user.inAppCurrency -= amount;
        yield user.save();
        res.status(200).json({ message: 'Currency deducted successfully', inAppCurrency: user.inAppCurrency });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deductCurrency = deductCurrency;
