import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";
import { useAppSelector } from "../hooks/useRedux";

export default function PrivateRoute() {
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
