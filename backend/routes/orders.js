import { Router } from 'express';
import { createOrder, getMyOrders, getOrderCount } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/count', protect, getOrderCount);

export default router;
