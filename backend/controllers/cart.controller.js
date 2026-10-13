const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: '_id name price image stock category',
    });

    return res.json({
      success: true,
      cart: customer.cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(req.user._id);
    const existingItem = customer.cart.find((item) => item.product.toString() === productId);
    const requestedQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (requestedQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} unit(s) available`,
      });
    }

    if (existingItem) {
      existingItem.quantity = requestedQuantity;
    } else {
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();
    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: '_id name price image stock category',
    });

    return res.json({
      success: true,
      message: 'Cart updated',
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(req.user._id);
    const cartItem = customer.cart.find((item) => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} unit(s) available`,
      });
    }

    cartItem.quantity = quantity;
    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: '_id name price image stock category',
    });

    return res.json({
      success: true,
      message: 'Cart quantity updated',
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const customer = await Customer.findById(req.user._id);
    const cartItem = customer.cart.find((item) => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    customer.cart = customer.cart.filter((item) => item.product.toString() !== productId);
    await customer.save();

    const updatedCustomer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: '_id name price image stock category',
    });

    return res.json({
      success: true,
      message: 'Product removed from cart',
      cart: updatedCustomer.cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartQuantity, removeFromCart };
