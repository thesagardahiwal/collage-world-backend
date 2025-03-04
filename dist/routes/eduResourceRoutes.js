"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claudinary_1 = require("../config/claudinary");
const eduResourceController_1 = require("../controllers/eduResourceController");
const router = express_1.default.Router();
// Route to upload a resource (one at a time)
router.post('/upload', (0, claudinary_1.uploadFilesToCloudinary)('resource', 1), eduResourceController_1.uploadResource);
// Route to get a resource by ID
router.get('/:id', eduResourceController_1.getResourceById);
// Route to update a resource by ID
router.put('/:id', (0, claudinary_1.uploadFilesToCloudinary)('resource', 1), eduResourceController_1.updateResourceById);
// Route to delete a resource by ID
router.delete('/:id', eduResourceController_1.deleteResourceById);
// Admin routes
router.get('/admin', eduResourceController_1.getAllResources); // Get all resources for admin
router.delete('/admin/:id', eduResourceController_1.adminDeleteResource); // Admin delete any resource
exports.default = router;
