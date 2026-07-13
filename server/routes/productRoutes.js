const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/categories/all', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Any logged-in user (not just admins) can leave a review.
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
