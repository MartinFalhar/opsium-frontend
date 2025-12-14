import { useState } from "react";
import "./Catalog.css";

function CatalogContactLens({ client }) {
  const [selected, setSelected] = useState("1D");

  console.log("CatalogContactLens - user:", client.name);
  return (
    <div>
      <div
        className="input-panel"
        style={{
          flexDirection: "row",
        }}
      >
        <div
          className="cl-specific"
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "10px",
            flex: "1",
          }}
        >
          <h2>Filtr kontaktních čoček</h2>
          <div className="segmented-control">
            {["1D", "7D", "14D", "30D", "více"].map((value) => (
              <button
                key={value}
                className={`button-controler ${
                  selected === value ? "active" : ""
                }`}
                onClick={() => setSelected(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="segmented-control">
            {["MONO", "ASTG", "MTF", "Myopia Control"].map((value) => (
              <button
                key={value}
                className={`button-controler ${
                  selected === value ? "active" : ""
                }`}
                onClick={() => setSelected(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="segmented-control">
            {["Alcon", "Bausch+Lomb", "Coopervision", "Johnson&Johnson"].map(
              (value) => (
                <button
                  key={value}
                  className={`button-controler ${
                    selected === value ? "active" : ""
                  }`}
                  onClick={() => setSelected(value)}
                >
                  {value}
                </button>
              )
            )}
          </div>
          <div className="segmented-control">
            {[
              "Total",
              "Oasys",
              "Ultra",
              "PureVision",
              "Biofinty",
              "Precision",
              "Avaira",
            ].map((value) => (
              <button
                key={value}
                className={`button-controler ${
                  selected === value ? "active" : ""
                }`}
                onClick={() => setSelected(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div
          className="cl-direct-dioptric"
          style={{ flex: "1", color: "#000000" }}
        >
          <p>Hodnoty kontaktních čoček / brýlových čoček - vertex distance</p>
          <p> /SPH/CYL/AX/ADD/DOM</p>
          <p>P/-3.50/-1.25/180/+2.50/DOM</p>
          <p>L/-3.50/-1.25/180/+2.50/DOM</p>
          <p>Hodnota kontaktních čoček po přepočtu</p>
          <p>P/-3.50/-1.25/180/+2.50/DOM</p>
          <p>L/-3.50/-1.25/180/+2.50/DOM</p>
        </div>
      </div>
      <div className="input-panel">
        List container for contact lens
        <p>Expandable container</p>
      </div>
    </div>
  );
}

export default CatalogContactLens;
