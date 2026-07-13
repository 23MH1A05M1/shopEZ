import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/currency';

const statusClass = (status) => `badge badge-${status.toLowerCase()}`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap">Loading orders...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <h1 className="section-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">You haven't placed any orders yet.</div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-8).toUpperCase()}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{formatCurrency(o.totalPrice)}</td>
                  <td><span className={statusClass(o.status)}>{o.status}</span></td>
                  <td><Link to={`/orders/${o._id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
