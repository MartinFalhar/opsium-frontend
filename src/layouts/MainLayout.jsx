import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/footers/Footer";
import MainHeader from "../components/headers/MainHeader";

import "./MainLayout.css";
const MainLayout = ({ children }) => {
  return (
    <div className="layout-main">
      <MainHeader />
      <section className="layout-section">
        <nav className="layout-nav"></nav>
        <main className="layout-content">
          <div className="layout-main">
            <header>Header</header>
            <main>
              <Outlet />
            </main>
            <footer>Footer</footer>
          </div>
        </main>
      </section>
      <footer className="layout-footer">
        <Footer footerText="M.Falhar" className="layout-footer" />
      </footer>
    </div>
  );
};

export default MainLayout;
