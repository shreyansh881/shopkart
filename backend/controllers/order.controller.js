const crypto = require('crypto');
const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const getRazorpay = require('../config/razorpay');

const validateShippingAddress = (shippingAddress) => {
  const requiredFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
  if (!shippingAddress || requiredFields.some((field) => !shippingAddress[field]?.trim())) {
    return false;
  }

  return /^\d{10}$/.test(shippingAddress.phone.replace(/\s/g, '')) &&
    /^\d{6}$/.test(shippingAddress.pincode.trim());
};

const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!validateShippingAddress(shippingAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid shipping details and a 10-digit phone number with a 6-digit pincode',
      });
    }

    const customer = await Customer.findById(req.user._id).populate({
      path: 'cart.product',
      select: '_id name price image stock',
    });

    if (customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay Test Mode credentials are not configured',
      });
    }

    const productIds = customer.cart.map((item) => item.product?._id).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    const items = customer.cart.map((cartItem) => {
      const productId = cartItem.product?._id?.toString() || cartItem.product?.toString();
      const product = productMap.get(productId);
      if (!product) {
        const error = new Error(`Product no longer available: ${productId || 'unknown product'}`);
        error.statusCode = 400;
        throw error;
      }

      if (cartItem.quantity > product.stock) {
        const error = new Error(`Insufficient stock for ${product.name}. Only ${product.stock} available.`);
        error.statusCode = 400;
        throw error;
      }

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      };
    });

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shopKartOrder = await Order.create({
      user: req.user._id,
      items,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      totalAmount,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT',
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: shopKartOrder._id.toString(),
    });

    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    return res.status(201).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      totalAmount,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to create payment order',
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      shopKartOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    const order = await Order.findOne({ _id: shopKartOrderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment details are required' });
    }

    if (razorpay_order_id !== order.razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'Invalid payment order' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const customer = await Customer.findById(req.user._id);
    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    customer.cart = [];
    await customer.save();

    return res.json({
      success: true,
      message: 'Payment verified and order placed',
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment, getOrders, getOrder };
