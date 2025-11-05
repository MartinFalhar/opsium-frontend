import React from "react";
import { useEffect, useState } from "react";
import "./Assistant.css";
import Modal from "../../components/modal/Modal.jsx";

import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function Assistant() {
  const { user, setHeaderClients } = useUser();

  return (
    <div className="clients-container">
      <div className="clients-left-column">
        <div className="button-group">
          <h1>Button Group</h1>
        </div>
        <div className="clients-search-container">
          <div className="client-search">
            <input
              className="client-search-input"
              type="text"
              // value={searchClient}
              // onChange={(e) => setSearchClient(e.target.value)}
              placeholder="Hledej klienta"
            />
            <button type="submit">Hledej</button>
          </div>
        </div>
        <div className="clients-list-container"></div>
        <div className="info-box">
          <h1>Assistant EXTERNAL MODULE</h1>
          <h2>Assistant EXTERNAL MODULE</h2>
          <h3>Assistant EXTERNAL MODULE</h3>
          <h4>Assistant EXTERNAL MODULE</h4>
          <h5>Assistant EXTERNAL MODULE</h5>
          <h6>Assistant EXTERNAL MODULE</h6>
        </div>
      </div>{" "}
      <div>
        {/* {showModal && (
          <Modal
            fields={fields}
            onSubmit={handleSubmit}
            onClose={() => setShowModal(false)}
          />
        )} */}
      </div>
      <div className="clients-right-column">
        <h1>Filtry</h1>
      </div>
    </div>
  );
}

export default Assistant;
