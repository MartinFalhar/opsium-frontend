import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
// import AuthLayout from "./layouts/AuthLayout";
// import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import Optotyp from "./components/optotyp/Optotyp";
import OptotypLayout from "./layouts/OptotypLayout";
import Vistraining from "./components/vistraining/Vistraining";
import VistrainingLayout from "./layouts/VistrainingLayout";
import Logout from "./components/login/Logout";
import Clients from "./components/clients/Clients";
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
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
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
