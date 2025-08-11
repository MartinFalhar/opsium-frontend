import React from "react";
import OpsiumLogo from "../../styles/images/opsium-logo-gray.png"; // Adjust the path as necessary

function MainHeader() {
  return (
    <header className="layout-header">
      <img
        alt="Opsium logo"
        src={OpsiumLogo}
        style={{ width: "130px", objectFit: "contain", paddingLeft: "20px" }}
      ></img>
      <h1 style={{ fontSize: "30px" }}>
        .: OPSIUM :: An optometry software :.
      </h1>
    </header>
  );
}

export default MainHeader;
