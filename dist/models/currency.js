"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const currencyController_1 = require("../controllers/currencyController");
const router = express_1.default.Router();
// Route to add currency
router.post('/currency/add', currencyController_1.addCurrency);
// Route to deduct currency
router.post('/currency/deduct', currencyController_1.deductCurrency);
exports.default = router;
