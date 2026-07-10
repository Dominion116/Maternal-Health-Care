import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { PageLoader } from "@/components/atoms/Spinner";

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  return (
    <ProtectedRoute roles={["admin", "researcher", "super_admin"]}>
      {children}
    </ProtectedRoute>
  );
}

export function GuestRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated) {
    return (
      <Navigate to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.CHAT} replace />
    );
  }
  return children;
}
