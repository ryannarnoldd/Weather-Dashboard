import { Router } from 'express';
const router = Router();

import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';

// Both apiroutes and htmlroutes are used.
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router;
