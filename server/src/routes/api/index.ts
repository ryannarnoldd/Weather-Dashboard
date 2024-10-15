import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';

// Main router. It will use dist/index.html.    
router.use('/weather', weatherRoutes);

export default router;
