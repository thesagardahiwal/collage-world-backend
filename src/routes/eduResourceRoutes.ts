import express from 'express';
import { createResource, getResources, getResourceById } from '../controllers/eduResourceController';

const router = express.Router();

router.post('/resources', createResource);
router.get('/resources', getResources);
router.get('/resources/:id', getResourceById);

export default router;