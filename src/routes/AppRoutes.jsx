import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

// Auth
import Login from "../pages/Login";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import Managers from "../pages/admin/Managers";
import AdminUsers from "../pages/admin/Users";
import AdminDashboards from "../pages/admin/Dashboards";

// Manager
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import MyUsers from "../pages/manager/MyUsers";
import MyDashboards from "../pages/manager/MyDashboards";

// User
import UserDashboard from "../pages/user/UserDashboard";
import MyTeam from "../pages/user/MyTeam";

const AppRoutes = () => {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "manager") return "/manager/dashboard";
    return "/user/dashboard";
  };

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/unauthorized" element={
        <div className="flex items-center justify-center h-screen bg-gray-950 text-white text-2xl">
          ⛔ Unauthorized Access
        </div>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/managers" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <Managers />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboards" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboards />
        </ProtectedRoute>
      } />

      {/* Manager Routes */}
      <Route path="/manager/dashboard" element={
        <ProtectedRoute allowedRoles={["manager"]}>
          <ManagerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/manager/users" element={
        <ProtectedRoute allowedRoles={["manager"]}>
          <MyUsers />
        </ProtectedRoute>
      } />
      <Route path="/manager/dashboards" element={
        <ProtectedRoute allowedRoles={["manager"]}>
          <MyDashboards />
        </ProtectedRoute>
      } />

      {/* User Routes */}
      <Route path="/user/dashboard" element={
        <ProtectedRoute allowedRoles={["user"]}>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/user/team" element={
        <ProtectedRoute allowedRoles={["user"]}>
          <MyTeam />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;