import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { resolveImageUrl } from '../services/imageUrl';
import { formatCurrency } from '../utils/currency';

const statusClass = (status) => `badge badge-${status.toLowerCase()}`;

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((err) => setError(err.response?.data?.message || 'Order not found'));
  }, [id]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!order) return <div className="spinner-wrap">Loading order...</div>;

  return (
    <div>
      <h1 className="section-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <span className={statusClass(order.status)}>{order.status}</span>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 30, marginTop: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3>Items</h3>
          {order.items.map((item) => (
            <div className="cart-row" key={item.product}>
              <img src={resolveImageUrl(item.imageUrl)} alt={item.name} />
              <div style={{ flex: 1 }}>
                <strong>{item.name}</strong>
                <p className="muted" style={{ margin: '4px 0' }}>Qty: {item.quantity} × {formatCurrency(item.price)}</p>
              </div>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}

          <h3 style={{ marginTop: 24 }}>Shipping Address</h3>
          <p className="muted">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.address}, {order.shippingAddress.city}<br />
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>

        <div className="card cart-summary" style={{ height: 'fit-content' }}>
          <h3>Payment Summary</h3>
          <div className="flex-between"><span>Items</span><span>{formatCurrency(order.itemsPrice)}</span></div>
          <div className="flex-between"><span>Shipping</span><span>{formatCurrency(order.shippingPrice)}</span></div>
          <div className="flex-between" style={{ fontWeight: 700, marginTop: 8 }}>
            <span>Total</span><span>{formatCurrency(order.totalPrice)}</span>
          </div>
          <p className="muted" style={{ marginTop: 12, fontSize: '0.85rem' }}>Payment method: {order.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
