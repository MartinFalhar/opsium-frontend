import React from "react";
import "./LayoutMain.css"; // Assuming you have a CSS file for styling
import OpsiumLogo from "./../styles/images/opsium-logo-wht.png"; // Adjust the path as necessary

const LayoutMain = ({ children }) => {
  return (
    <div className="layout-main">
      <header className="layout-header">
        <img
          alt="Opsium logo"
          src={OpsiumLogo}
          style={{ width: "100px" }}
        ></img>
        <h1>WELCOME, dear sheapard!</h1>
      </header>
      <section className="layout-section">
        <nav className="layout-nav">
          <ul>
            <li>MENU 1</li>
            <li>MENU 2</li>
            <li>MENU 3</li>
            <li>MENU 4</li>
          </ul>
        </nav>
        <main className="layout-content">{children}</main>
      </section>
      <footer className="layout-footer">
        <p>© {new Date().getFullYear()} Opsium. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LayoutMain;
