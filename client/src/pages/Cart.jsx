import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../services/imageUrl';
import { formatCurrency } from '../utils/currency';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(userInfo ? '/checkout' : '/login?redirect=/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 10 }}>Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">Your Cart</h1>
      <div className="card" style={{ padding: '0 20px' }}>
        {cartItems.map((item) => (
          <div className="cart-row" key={item.product}>
            <img src={resolveImageUrl(item.imageUrl)} alt={item.name} />
            <div style={{ flex: 1 }}>
              <strong>{item.name}</strong>
              <p className="muted" style={{ margin: '4px 0' }}>{formatCurrency(item.price)} each</p>
            </div>
            <input
              type="number"
              className="form-control qty-input"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product, Math.max(1, Number(e.target.value)))}
            />
            <strong style={{ width: 80, textAlign: 'right' }}>{formatCurrency(item.price * item.quantity)}</strong>
            <button className="btn btn-outline btn-sm" onClick={() => removeFromCart(item.product)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="card cart-summary" style={{ maxWidth: 320, marginTop: 20, marginLeft: 'auto' }}>
        <div className="flex-between" style={{ marginBottom: 10 }}>
          <span>Subtotal</span>
          <strong>{formatCurrency(totalPrice)}</strong>
        </div>
        <p className="muted" style={{ fontSize: '0.85rem' }}>Shipping and totals calculated at checkout.</p>
        <button className="btn btn-primary btn-block" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
