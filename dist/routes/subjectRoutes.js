"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subjectController_1 = require("../controllers/subjectController");
const router = express_1.default.Router();
router.post('/subjects', subjectController_1.createSubject);
router.get('/subjects', subjectController_1.getSubjects);
router.get('/subjects/:id', subjectController_1.getSubjectById);
exports.default = router;
