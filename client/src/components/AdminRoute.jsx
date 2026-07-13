import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { userInfo } = useAuth();
  return userInfo && userInfo.role === 'ADMIN' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
