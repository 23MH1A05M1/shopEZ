import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../services/imageUrl';
import { formatCurrency } from '../utils/currency';
import StarRating from '../components/StarRating';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchProduct = () => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((err) => setError(err.response?.data?.message || 'Product not found'));
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!product) return <div className="spinner-wrap">Loading...</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const alreadyReviewed = userInfo
    ? product.reviews?.some((r) => String(r.user) === String(userInfo._id))
    : false;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewRating(5);
      fetchProduct(); // refresh product so the new review + updated average rating show immediately
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div>
      <div className="product-detail">
        <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
        <div>
          <span className="product-category">{product.category}</span>
          <h1 style={{ margin: '8px 0' }}>{product.name}</h1>

          {product.numReviews > 0 ? (
            <div className="flex" style={{ alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <StarRating value={product.rating} />
              <span className="muted">{product.rating.toFixed(1)} · {product.numReviews} review{product.numReviews !== 1 ? 's' : ''}</span>
            </div>
          ) : (
            <p className="muted" style={{ marginBottom: 8 }}>No reviews yet</p>
          )}

          <p className="muted">{product.description}</p>
          <h2 className="product-price">{formatCurrency(product.price)}</h2>
          <p className="muted">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>

          {added && <div className="alert alert-success">Added to cart!</div>}

          {product.stock > 0 && (
            <div className="flex" style={{ gap: 10, marginBottom: 16 }}>
              <input
                type="number"
                className="form-control qty-input"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              />
              <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/cart');
                }}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Reviews section --- */}
      <div style={{ marginTop: 40, maxWidth: 700 }}>
        <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Customer Reviews</h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div style={{ marginBottom: 24 }}>
            {product.reviews
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((r) => (
                <div key={r._id} className="card" style={{ padding: 16, marginBottom: 12 }}>
                  <div className="flex-between">
                    <strong>{r.name}</strong>
                    <span className="muted" style={{ fontSize: '0.8rem' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating value={r.rating} size="0.9rem" />
                  <p style={{ marginTop: 8, marginBottom: 0 }}>{r.comment}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="muted" style={{ marginBottom: 24 }}>Be the first to review this product.</p>
        )}

        {/* Review submission form */}
        {!userInfo ? (
          <p className="muted">
            <Link to={`/login?redirect=/product/${id}`}>Log in</Link> to write a review.
          </p>
        ) : alreadyReviewed ? (
          <p className="muted">You've already reviewed this product.</p>
        ) : (
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>Write a Review</h3>
            {reviewError && <div className="alert alert-error">{reviewError}</div>}
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Your Rating</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewRating(n)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.6rem',
                        color: n <= reviewRating ? '#b45309' : '#d4d4d2',
                        padding: 0,
                        lineHeight: 1,
                      }}
                      aria-label={`${n} star${n !== 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  className="form-control"
                  rows={3}
                  required
                  placeholder="Share your thoughts about this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
