import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuth, allowedRoles, userRole, children }) => {
  if (!isAuth) {
    return <Navigate to="/404" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/404" replace />;
  }
  // Autenticado y tiene rol permitido
  return children;
};

export default ProtectedRoute;
