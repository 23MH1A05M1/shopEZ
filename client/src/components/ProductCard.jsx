import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../services/imageUrl';
import { formatCurrency } from '../utils/currency';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="card product-card">
      <img src={resolveImageUrl(product.imageUrl)} alt={product.name} />
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        {product.numReviews > 0 && (
          <div className="flex" style={{ alignItems: 'center', gap: 6 }}>
            <StarRating value={product.rating} size="0.85rem" />
            <span className="muted" style={{ fontSize: '0.78rem' }}>({product.numReviews})</span>
          </div>
        )}
        <div className="flex-between">
          <span className="product-price">{formatCurrency(product.price)}</span>
          {product.stock === 0 && <span className="out-of-stock">Out of stock</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
