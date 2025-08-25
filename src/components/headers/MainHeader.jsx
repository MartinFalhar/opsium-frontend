import React from "react";
import OpsiumLogo from "../../styles/images/opsium-logo-gray.png"; // Adjust the path as necessary
import "./MainHeader.css";
import { useNavigate } from "react-router-dom"; // Ensure you have the CSS file for styling

function MainHeader() {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/"); // Navigate to the home page when the logo is clicked
  };
  return (
    <header className="layout-header">
      <img
        alt="Opsium logo"
        src={OpsiumLogo}
        style={{ width: "130px", objectFit: "contain", paddingLeft: "20px" }}
        onClick={handleLogoClick}
        className="header-logo"
      ></img>
      <div className="header-title">
        <p style={{ fontSize: "20px" }}>
          OPSIUM : optical smart instrument for user mastery
        </p>
      </div>
    </header>
  );
}

export default MainHeader;
