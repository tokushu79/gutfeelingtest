import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isReady } = useAdminAuth();

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Checking session…</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
