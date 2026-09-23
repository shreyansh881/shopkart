const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Customer = require('../models/customer.model');

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await Customer.findById(req.user._id);
    const alreadyWishlisted = user.wishlist.some((item) => item.toString() === productId);

    if (alreadyWishlisted) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist' });
    }

    user.wishlist.push(product._id);
    await user.save();

    return res.status(200).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name description price category image stock',
    });

    return res.json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const user = await Customer.findById(req.user._id);
    const exists = user.wishlist.some((item) => item.toString() === productId);

    if (!exists) {
      return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
    }

    user.wishlist = user.wishlist.filter((item) => item.toString() !== productId);
    await user.save();

    return res.json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
