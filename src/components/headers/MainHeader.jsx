import React from "react";
import OpsiumLogo from "../../styles/images/opsium-logo-wht.png"; // Adjust the path as necessary

function MainHeader() {
  return (
    <header className="layout-header">
      <img
        alt="Opsium logo"
        src={OpsiumLogo}
        style={{ width: "150px", objectFit: "contain" }}
      ></img>
      <h1>WELCOME, dear sheapard!</h1>
    </header>
  );
}

export default MainHeader;
