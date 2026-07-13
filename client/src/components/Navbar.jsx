import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Shop<span>EZ</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">
            Cart {itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
          </Link>
          {userInfo ? (
            <>
              <Link to="/orders">My Orders</Link>
              {userInfo.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
              <span className="muted">Hi, {userInfo.name.split(' ')[0]}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
