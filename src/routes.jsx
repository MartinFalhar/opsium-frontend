import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
// import AuthLayout from "./layouts/AuthLayout";
// import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import Optotyp from "./features/optotyp/Optotyp";
import OptotypLayout from "./layouts/OptotypLayout";
import Vistraining from "./features/vistraining/Vistraining";
import VistrainingLayout from "./layouts/VistrainingLayout";
import Logout from "./features/settings/SettingsLogout";
import Clients from "./features/clients/Clients";
import Client from "./features/client/Client";
import Settings from "./features/settings/Settings";
import Admin from "./features/admin/Admin";
import Superadmin from "./features/superadmin/Superadmin";
// import LoginPage from "./pages/LoginPage";
// import AdminDashboard from "./pages/AdminDashboard";
// import NotFound from "./pages/NotFound";

export default function RoutesConfig() {
  return (
    <Routes>
      {/* Veřejná část webu */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/optotyp" element={<Optotyp />} />
        <Route path="/visual-training" element={<Vistraining />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client/:id" element={<Client />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/superadmin" element={<Superadmin />} />

        <Route path="*" />
      </Route>

      <Route element={<OptotypLayout />}>
        <Route path="/optotyp-testing" element={null} />
      </Route>

      <Route element={<VistrainingLayout />}>
        <Route path="/visual-training-testing" element={null} />
      </Route>
    </Routes>
  );
}
