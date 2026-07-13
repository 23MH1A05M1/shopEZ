import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="section-title">Admin Dashboard</h1>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <Link to="/admin/products" className="card" style={{ padding: 24 }}>
          <h3>Manage Products</h3>
          <p className="muted">Add, edit, or remove products from the catalog.</p>
        </Link>
        <Link to="/admin/orders" className="card" style={{ padding: 24 }}>
          <h3>Manage Orders</h3>
          <p className="muted">View all orders and update their status.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
