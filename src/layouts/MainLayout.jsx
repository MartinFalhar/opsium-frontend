import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/footers/Footer";
import MainHeader from "../components/headers/MainHeader";
import MainMenu from "../components/main-menu/MainMenu";

import "./MainLayout.css";
const MainLayout = () => {
  return (
    <div className="layout-main">
      <MainHeader className="layout-header" />
      <section className="layout-section">
        <nav className="layout-nav">
          <MainMenu rights={0} />
        </nav>
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
