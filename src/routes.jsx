import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
// import AuthLayout from "./layouts/AuthLayout";
// import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import AdminDashboard from "./pages/AdminDashboard";
// import NotFound from "./pages/NotFound";

export default function RoutesConfig() {
  return (
    <Routes>
      {/* Veřejná část webu */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
