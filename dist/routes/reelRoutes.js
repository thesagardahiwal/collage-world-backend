"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reelController_1 = require("../controllers/reelController");
const router = (0, express_1.Router)();
router.get('/', reelController_1.getAllReels);
exports.default = router;
