import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/currency';

const statusClass = (status) => `badge badge-${status.toLowerCase()}`;
const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="spinner-wrap">Loading orders...</div>;

  return (
    <div>
      <h1 className="section-title">Manage Orders</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {orders.length === 0 ? (
        <div className="empty-state">No orders yet.</div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Update</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name} <br /><span className="muted">{o.user?.email}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{formatCurrency(o.totalPrice)}</td>
                  <td><span className={statusClass(o.status)}>{o.status}</span></td>
                  <td>
                    <select
                      className="form-control"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
