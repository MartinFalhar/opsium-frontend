import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
// import AuthLayout from "./layouts/AuthLayout";
// import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import Logout from "./features/settings/SettingsLogout";

import Client from "./features/client/Client";
import Vistraining from "./features/vistraining/Vistraining";
import VistrainingLayout from "./layouts/VistrainingLayout";

import Dashboard from "./features/dashboard/Dashboard";
import Clients from "./features/clients/Clients";
import Orders from "./features/invoices/Orders";
import OrderNew from "./features/invoices/OrderNew";
import Cashdesk from "./features/cashdesk/Cashdesk";
import Assistant from "./features/assistant/Assistant";
import Store from "./features/store/Store";
import Catalog from "./features/catalog/Catalog";
import Insurance from "./features/insurance/Insurance";
import Agenda from "./features/agenda/Agenda";

import Optotyp from "./features/optotyp/Optotyp";
import OptotypLayout from "./layouts/OptotypLayout";

import Admin from "./features/admin/Admin";
import Superadmin from "./features/superadmin/Superadmin";

import Settings from "./features/settings/Settings";
// import LoginPage from "./pages/LoginPage";
// import AdminDashboard from "./pages/AdminDashboard";
// import NotFound from "./pages/NotFound";

export default function RoutesConfig() {
  return (
    <Routes>
      {/* Veřejná část webu */}
      <Route element={<MainLayout />}>
        <Route path="/client/:id" element={<Client />} />
        <Route path="/visual-training" element={<Vistraining />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/new-order" element={<OrderNew />} />
        <Route path="/cashdesk" element={<Cashdesk />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/store" element={<Store />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/optotyp" element={<Optotyp />} />




        <Route path="/admin" element={<Admin />} />
        <Route path="/superadmin" element={<Superadmin />} />

        <Route path="/settings" element={<Settings />} />

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
