import React from "react";
import "./Cashdesk.css";

const API_URL = import.meta.env.VITE_API_URL;

function Cashdesk() {

  return (
    <div className="clients-container">
      <div className="clients-left-column">
        <div className="clients-list-container">
          <div className="button-group">
            <h1>Button Group</h1>
          </div>
        </div>
        <div className="info-box">
          <h2>Cashdesk EXTERNAL MODULE</h2>
        </div>
      </div>{" "}
      <div className="clients-right-column">
        <h1>Filtry</h1>
      </div>
    </div>
  );
}

export default Cashdesk;
