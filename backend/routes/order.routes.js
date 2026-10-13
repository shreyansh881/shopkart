const express = require('express');
const protect = require('../middlewares/auth.middleware');
const {
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrder,
} = require('../controllers/order.controller');

const router = express.Router();

router.post('/create-payment-order', protect, createPaymentOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
