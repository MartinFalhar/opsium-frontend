import React from "react";
import { useMemo, useEffect, useState } from "react";
import "./Insurance.css";
import Modal from "../../components/modal/Modal.jsx";
import Tabs from "../../components/controls/Tabs.jsx";

import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const BENEFIT_TABS = [
  { label: "Refrakce", value: "ref" },
  { label: "BINO", value: "bino" },
  { label: "Kontaktní čočky", value: "clens" },
  { label: "Zdraví", value: "health" },
];

const BENEFIT_CONTENT = {
  ref: [
    {
      title: "Far",
      modul: 3,
    },
    {
      title: "Near",
      modul: 3,
    },
    {
      title: "Middle",
      modul: 3,
    },
  ],
  bino: [
    {
      title: "MKH",
      modul: 1,
    },
    {
      title: "FV-FAR",
      modul: 1,
    },
    {
      title: "FV-NEAR",
      modul: 3,
    },
  ],
  clens: [
    {
      title: "Tears",
      modul: 3,
    },
    {
      title: "Push-up",
      modul: 3,
    },
  ],
  health: [
    {
      title: "IOT",
      modul: 3,
    },
    {
      title: "Angle",
      modul: 3,
    },
  ],
};

function Insurance() {
  const { user, setHeaderClients } = useUser();
  const [activeTab, setActiveTab] = useState(BENEFIT_TABS[0].value);
  const activeContent = useMemo(
    () => BENEFIT_CONTENT[activeTab] ?? BENEFIT_CONTENT.dneye,
    [activeTab],
  );
  const [selectedModule, setSelectedModule] = useState(null);
  const handleModuleClick = (modul) => {
    setSelectedModule(modul); // hodnota "modul" jako prop pro další použití
    window.showToast(`Zvolený modul: ${modul}`);
  };

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="test-menu">
            <div>
              <h2 className="dark">Moduly</h2>
            </div>
            <div className="insurance-tabs-header">
              <Tabs
                items={BENEFIT_TABS}
                selectedValue={activeTab}
                onChange={setActiveTab}
              />
            </div>
            <div className="submenu-container">
              {activeContent.map((item, index) => (
                <button
                  key={`${activeTab}-${item.title}-${index}`}
                  type="button"
                  className={`submenu-button-controler ${selectedModule === item.modul ? "active" : ""}`}
                  data-modul={item.modul}
                  onClick={() => handleModuleClick(item.modul)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className="clients-list-container"
          style={{
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: "10px",
            padding: "10px",
            height: "80vh",
          }}
        >
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
            style={{
              background: "var(--color-grd-app-accent)",
              height: "7px",
              padding: "0",
              border: "none",
              borderRadius: "0",
            }}
          ></div>
          <div>
            <h1>Tohle je H1</h1>
            <h2>Tohle je H2</h2>
            <h3>Tohle je H3</h3>
            <h4>Tohle je H4</h4>
            <h5>Tohle je H5</h5>
            <h6>Tohle je H6</h6>
          </div>
          <div>
            <h1 className="dark">Tohle je H1</h1>
            <h2 className="dark">Tohle je H2</h2>
            <h3 className="dark">Tohle je H3</h3>
            <h4 className="dark">Tohle je H4</h4>
            <h5 className="dark">Tohle je H5</h5>
            <h6 className="dark">Tohle je H6</h6>
          </div>
        </div>{" "}
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
