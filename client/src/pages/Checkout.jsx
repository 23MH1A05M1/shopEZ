import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', address: '', city: '', postalCode: '', country: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const shipping = totalPrice > 999 ? 0 : 49;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const items = cartItems.map((item) => ({ product: item.product, quantity: item.quantity }));
      const { data } = await api.post('/orders', { items, shippingAddress: form, paymentMethod: 'Cash on Delivery' });
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="empty-state">Your cart is empty. Add items before checking out.</div>;
  }

  return (
    <div>
      <h1 className="section-title">Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 30 }}>
        <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" name="fullName" required value={form.fullName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="form-control" name="address" required value={form.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>City</label>
            <input className="form-control" name="city" required value={form.city} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input className="form-control" name="postalCode" required value={form.postalCode} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input className="form-control" name="country" required value={form.country} onChange={handleChange} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Placing order...' : 'Place Order (Cash on Delivery)'}
          </button>
        </form>

        <div className="card cart-summary" style={{ height: 'fit-content' }}>
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div className="flex-between" key={item.product} style={{ marginBottom: 8, fontSize: '0.9rem' }}>
              <span>{item.name} x{item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
          <div className="flex-between"><span>Subtotal</span><span>{formatCurrency(totalPrice)}</span></div>
          <div className="flex-between"><span>Shipping</span><span>{formatCurrency(shipping)}</span></div>
          <div className="flex-between" style={{ fontWeight: 700, marginTop: 8 }}>
            <span>Total</span><span>{formatCurrency(totalPrice + shipping)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
