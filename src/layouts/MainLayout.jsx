import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/footers/Footer";
import MainHeader from "../components/headers/MainHeader";

import "./MainLayout.css";
const MainLayout = () => {
  return (
    <div className="layout-main">
      <MainHeader className="layout-header" />
      <section className="layout-section">
        <nav className="layout-nav">Optotyp</nav>
        <div className="layout-content">
          <Outlet />
          {/* Pages/HomePage.jsx*/}
        </div>
      </section>
      <Footer className="layout-footer" footerText="Martin Falhar" />
    </div>
  );
};

export default MainLayout;
