import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Clients.css"; // Assuming you have a CSS file for styling

function Clients(props) {
  return (
    <footer className="layout-footer">
      <p>
        © {new Date().getFullYear()} Opsium,{" " + props.footerText}. All rights
        reserved.
      </p>
    </footer>
  );
}

export default Clients;
