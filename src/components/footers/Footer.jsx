import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Footer.css"; // Assuming you have a CSS file for styling

function Footer(props) {
  return (
    <footer className="layout-footer">
      <p>
        © {new Date().getFullYear()} Opsium,{" " + props.footerText}. All rights
        reserved.
      </p>
    </footer>
  );
}

export default Footer;
