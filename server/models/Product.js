const mongoose = require('mongoose');

// Sub-document schema for a single customer review, embedded directly inside
// each product (not a separate top-level collection, since reviews are always
// accessed in the context of one specific product).
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },      // reviewer's display name, copied at review time
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: 'https://via.placeholder.com/400x400?text=Product' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
