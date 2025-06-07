import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuth: boolean;
  allowedRoles?: string[];
  userRole: string;
  children: React.ReactNode;
}

const ProtectedRoute = ({ isAuth, allowedRoles, userRole, children }: ProtectedRouteProps) => {
  if (!isAuth) {
    return <Navigate to="/*" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/*" replace />;
  }
  // Autenticado y tiene rol permitido
  return children;
};

export default ProtectedRoute;