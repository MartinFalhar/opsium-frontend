import React from "react";
import { useEffect, useState } from "react";
import "./Insurance.css";
import Modal from "../../components/modal/Modal.jsx";

import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function Insurance() {
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
        <div className="clients-list-container"
        style={{
          overflowY:"auto",
          display:"grid",
          gridTemplateColumns:"repeat(5, 1fr)",
          gap:"10px",
          padding:"10px",
          height:"60vh"
        }}>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g1)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g2)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g3)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g4)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g5)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g6)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g7)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g8)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g9)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g10)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g11)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g12)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g13)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g14)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g15)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g16)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-g17)" }}
          ></div>
          <div
            className="info-box"
            style={{ background: "var(--color-grd-app-accent)",
              height:"7px",
              padding:"0",
              border:"none",
              borderRadius:"0"
             }}
          ></div>
        </div>
      <h1>Tohle je H1</h1>
      <h2>Tohle je H2</h2>
      <h3>Tohle je H3</h3>
      <h4>Tohle je H4</h4>
      <h5>Tohle je H5</h5>
      <h6>Tohle je H6</h6>
   

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

export default Insurance;
