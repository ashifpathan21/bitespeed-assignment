import express from 'express'
import { getDetails } from '../controllers/contactController.js';
const router = express.Router();

router.post('/identify', getDetails)

export default router;