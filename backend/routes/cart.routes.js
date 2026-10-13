const express = require('express');
const protect = require('../middlewares/auth.middleware');
const { getCart, addToCart, updateCartQuantity, removeFromCart } = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/:productId', protect, addToCart);
router.patch('/:productId', protect, updateCartQuantity);
router.delete('/:productId', protect, removeFromCart);

module.exports = router;
