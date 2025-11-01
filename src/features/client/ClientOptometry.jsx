import { useState } from "react";
import "./ClientOptometry.css";

function ClientOptometry() {
  const [sph, setSph] = useState("");

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
          <div className="optometry-anamnesis">
            <h3>Anamnéza</h3>
            <textarea
              style={{
                padding: "5px",
                borderRadius: "5px",
                width: "100%",
                height: "80%",
              }}
            />
          </div>
          <div className="optometry-anamnesis">
            <h3>Naturální vizus</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>
          <div className="optometry-anamnesis">
            <h3>ARK</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>
          <div className="optometry-anamnesis">
            <h3>Anamnéza</h3>
            <textarea
              style={{
                padding: "5px",
                borderRadius: "5px",
                width: "100%",
                height: "80%",
              }}
            />
          </div>
          <div className="optometry-anamnesis">
            <h3>Naturální vizus</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>
          <div className="optometry-anamnesis">
            <h3>ARK</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>{" "}
          <div className="optometry-anamnesis">
            <h3>Anamnéza</h3>
            <textarea
              style={{
                padding: "5px",
                borderRadius: "5px",
                width: "100%",
                height: "80%",
              }}
            />
          </div>
          <div className="optometry-anamnesis">
            <h3>Naturální vizus</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>
          <div className="optometry-anamnesis">
            <h3>ARK</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>{" "}
          <div className="optometry-anamnesis">
            <h3>Anamnéza</h3>
            <textarea
              style={{
                padding: "5px",
                borderRadius: "5px",
                width: "100%",
                height: "80%",
              }}
            />
          </div>
          <div className="optometry-anamnesis">
            <h3>Naturální vizus</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>
          <div className="optometry-anamnesis">
            <h3>ARK</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>{" "}
          <div className="optometry-anamnesis">
            <h3>Anamnéza</h3>
            <textarea
              style={{
                padding: "5px",
                borderRadius: "5px",
                width: "100%",
                height: "80%",
              }}
            />
          </div>
          <div className="optometry-anamnesis">
            <h3>Naturální vizus</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
              </div>
            </div>
          </div>
          <div className="optometry-anamnesis">
            <h3>ARK</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
              className="optometry-natural-vizus"
            >
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="P oko" />
                <input type="text" placeholder="L oko" />
              </div>
              <div>
                <input type="text" placeholder="BINO" />
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
