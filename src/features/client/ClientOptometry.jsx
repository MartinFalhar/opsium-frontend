// import { useState } from "react";
import "./ClientOptometry.css";

function ClientOptometry() {
  // const [sph, setSph] = useState("");

  return (
    <div className="optometry-container">
      <div className="optometry-left-container">
        <div className="optometry-control-bar">
          <button className="optometry-control-bar-button">Vizus</button>
          <button className="optometry-control-bar-button">ASTG</button>
          <button className="optometry-control-bar-button">BINO</button>
          <button className="optometry-control-bar-button">CLENS</button>
          <button className="optometry-control-bar-button">MEDIC</button>
          <button type="submit">Uložit</button>
        </div>

        <div className="optometry-area">
          <div className="optometry-item w25">
            <div className="optometry-item-head">
              <p>Anamnéza</p>
            </div>
            <div className="optometry-item-body">
              <textarea className="optometry-item-textarea" />
            </div>
          </div>

          <div className="optometry-item w50">
            <div className="optometry-item-head">
              <p>Anamnéza</p>
            </div>
            <div className="optometry-item-body">
              <textarea className="optometry-item-textarea" />
            </div>
          </div>

          <div className="optometry-item w25">
            <div className="optometry-item-head">
              <p>Anamnéza</p>
            </div>
            <div className="optometry-item-body">
              <textarea className="optometry-item-textarea" />
            </div>
          </div>

          <div
            className="optometry-natural-vizus"
            style={{
              width: "230px",
              padding: "10px",
              border: "2px solid var(--color-el-e)",
              boxShadow: "0 0 10px var(--color-el-e)",
            }}
          >
            <p
              style={{
                color: "var(--color-bg-b12)",
                marginBottom: "5px",
              }}
            >
              NATURÁLNÍ VIZUSX
            </p>
            <div
              //NV container
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                height: "80%",
                width: "200px",
                paddingLeft: "15px",
              }}
            >
              <div
                className="NV-PL-eye"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignContent: "center",
                  height: "80%",
                  gap: "10px",
                }}
              >
                <p
                  style={{
                    fontSize: "1.1vw",
                    fontWeight: "bold",
                    color: "var(--color-bg-b12)",
                  }}
                >
                  P
                </p>
                <p
                  style={{
                    fontSize: "1.1vw",
                    fontWeight: "bold",
                    color: "var(--color-bg-b12)",
                  }}
                >
                  L
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignContent: "center",
                  height: "80%",
                  gap: "0px",
                }}
              >
                <input
                  className="nv-input"
                  type="text"
                  placeholder="Vizus P"
                  style={{
                    background: "var(--color-bg-b1)",
                    borderRadius: "0px",
                    fontSize: "1.0vw",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    borderBottom: "1px solid var(--color-el-m)",
                    color: "var(--color-bg-b12)",
                    fontWeight: "bold",
                    width: "80px",
                    height: "30px",
                    padding: "5px",
                    textAlign: "center",
                  }}
                />
                <input
                  className="nv-input"
                  type="text"
                  placeholder=""
                  style={{
                    background: "var(--color-bg-b1)",
                    borderRadius: "0px",
                    fontSize: "1.0vw",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    borderBottom: "1px solid var(--color-el-m)",
                    color: "var(--color-bg-b12)",
                    fontWeight: "bold",
                    width: "80px",
                    height: "30px",
                    padding: "5px",
                    textAlign: "center",
                  }}
                />
              </div>
              <div>
                <input
                  className="nv-input"
                  type="text"
                  placeholder=""
                  style={{
                    background: "var(--color-bg-b1)",
                    borderRadius: "0px",
                    fontSize: "1.3vw",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    borderBottom: "1px solid var(--color-el-m)",
                    color: "var(--color-bg-b12)",
                    fontWeight: "bold",
                    width: "80px",
                    height: "60%",
                    padding: "5px",
                    textAlign: "center",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="optometry-natural-vizus"
            style={{
              width: "230px",
              padding: "10px",
              background: "var(--color-bg-b3)",
              // border: "none",
            }}
          >
            <p
              style={{
                color: "var(--color-bg-b12)",
                marginBottom: "5px",
              }}
            >
              NATURÁLNÍ VIZUS
            </p>
            <div
              //NV container
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                height: "80%",
                width: "200px",
                paddingLeft: "15px",
              }}
            >
              <div
                className="NV-PL-eye"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignContent: "center",
                  height: "80%",
                  gap: "10px",
                }}
              >
                <p
                  style={{
                    fontSize: "1.1vw",
                    fontWeight: "bold",
                    color: "var(--color-bg-b12)",
                  }}
                >
                  P
                </p>
                <p
                  style={{
                    fontSize: "1.1vw",
                    fontWeight: "bold",
                    color: "var(--color-bg-b12)",
                  }}
                >
                  L
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignContent: "center",
                  height: "80%",
                  gap: "0px",
                  textAlign: "center",
                }}
              >
                <input
                  className="nv-input"
                  type="text"
                  placeholder="Vizus P"
                  style={{
                    background: "var(--color-bg-b3)",
                    fontSize: "1.0vw",
                    border: "none",
                    color: "var(--color-el-a)",
                    fontWeight: "bold",
                    width: "80px",
                    height: "30px",
                    padding: "5px",
                    textAlign: "center",
                  }}
                />
                <input
                  className="nv-input"
                  type="text"
                  placeholder="Vizus L"
                  style={{
                    background: "var(--color-bg-b3)",
                    fontSize: "1.0vw",
                    border: "none",
                    color: "var(--color-el-a)",
                    fontWeight: "bold",
                    width: "80px",
                    height: "30px",
                    padding: "5px",
                    textAlign: "center",
                  }}
                />
              </div>
              <div>
                <input
                  className="nv-input"
                  type="text"
                  placeholder="VN-BINO"
                  style={{
                    background: "var(--color-bg-b3)",
                    fontSize: "1.2vw",
                    border: "none",
                    color: "var(--color-el-e)",
                    fontWeight: "bold",
                    width: "90px",
                    height: "80%",
                    padding: "5px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right-container">
        <h3>INFO</h3>
      </div>
    </div>
  );
}

export default ClientOptometry;
