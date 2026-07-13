const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/auth');

// @desc    Upload a product image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    // Return a URL the frontend can use directly (served statically below)
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  });
});

module.exports = router;
