import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../context/store";

export default function RequireAuth() {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
