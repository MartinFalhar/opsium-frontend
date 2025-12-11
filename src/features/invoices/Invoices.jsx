import React from "react";
import "./Invoices.css";

const API_URL = import.meta.env.VITE_API_URL;

function Invoices() {

  return (
    <div className="clients-container">
      <div className="clients-left-column">
        <div className="clients-list-container">
          <div className="button-group">
            <h1>Button Group</h1>
          </div>
        </div>
        <div className="info-box">
          <h2>Invoices EXTERNAL MODULE</h2>
        </div>
      </div>{" "}
      <div className="clients-right-column">
        <h1>Filtry</h1>
      </div>
    </div>
  );
}

export default Invoices;