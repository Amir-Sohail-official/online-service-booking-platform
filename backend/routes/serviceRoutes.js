import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getServices);
router.get('/:id', protect, getServiceById);
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

export default router;








