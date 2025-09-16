import React from "react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
//USERCONTEXT uživatele
import { useUser } from "../../context/UserContext";
import OptotypMenu from "./OptotypMenu";
import "./Optotyp.css";
//API_URL pro požadavky na backend
const API_URL = import.meta.env.VITE_API_URL;

function Optotyp() {
  const navigate = useNavigate();

  const cardWidth = 8.56; //size of credit card in cm
  const cssPx = cardWidth * (96 / 2.54); // ≈ 323.53
  const devicePx = cssPx * window.devicePixelRatio;

  const [viewDistance, setViewDistance] = useState(100);
  const [sampleWidth, setSampleWidth] = useState(devicePx); // initial value in pixels
  //Segmented control pro výběr optotypu
  const [selected, setSelected] = useState("Dálka");
  const [typeCalibration, setTypeCalibration] = useState("Velikost");
  const [typeCalibrationSample, setTypeCalibrationSample] = useState("Karta");
  //zachytání vybraných testů
  const [selectedTests, setSelectedTests] = useState([]);
  //uživatelské údaje
  const { user } = useUser();

  //OPTOTYP LAYOUT - odesilam parametry a seznam testu
  //selectedTests jsou získané z OptotypMenu
  //prostřednictvím funkce actualStartTests
  //na route jde kalibrační vzdálenost, dálka
  //a seznam optytpových testů
  const handleClickStartButton = () => {
    navigate(
      `/optotyp-testing?mm2px=${(sampleWidth / 85.6).toFixed(2)}&viewDistance=${
        selected === "Dálka" ? viewDistance / 10 : viewDistance / 100
      }&test=${JSON.stringify(selectedTests)}`
    ); // přechod na stránku s předáním parametru zjištěný kalibrací
  };
  //uložení setu optotypu do databáze
  //posílání POST na backend
  const handleClickSave = async () => {
    const res = await fetch(`${API_URL}/saveoptotyp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
        tests: selectedTests,
      }),
    });
  };

  //získá uložené sety pro uživatele
  const handleClickLoad = async () => {
    const res = await fetch(`${API_URL}/loadoptotyp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
      }),
    });
    // zde získáš pole nebo objekt z backendu
    const data = await res.json();

    // Kontrola, zda je DATA typ ARRAY:
    //predavam jenom prvni SET
    if (Array.isArray(data[0])) {
      setSelectedTests(data[0]);
    } else {
      console.warn("Neočekávaný formát dat:", data[0]);
      setSelectedTests([]);
    }
  };

  // uložíme hodnotu slideru do stavu
  const handleChange = (e) => {
    setViewDistance(e.target.value);
  };
  //RENDER OPTOTYP
  return (
    <div className="optotyp-container">
      <div className="optotyp-settings">
        <div className="optotyp-left-column">
          <h1>Nastavení optotypu</h1>
          <div className="optotyp-distance-settings">
            <h3>Vzdálenost od obrazovky</h3>
            <div className="optotyp-controler-container">
              <div className="segmented-control">
                {["Dálka", "Blízko"].map((value) => (
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
              <div className="slider-container">
                <div className="slider-value">
                  <p>Vzdálenost od obrazovky: </p>
                  <p>
                    {selected === "Dálka"
                      ? viewDistance / 10
                      : viewDistance * 1}{" "}
                    {selected === "Dálka" ? "m" : "cm"}
                  </p>
                  <p>Akomodační zátěž: </p>
                  <p>
                    {Number(
                      selected === "Dálka"
                        ? 10 / viewDistance
                        : 100 / viewDistance
                    ).toFixed(2)}{" "}
                    D
                  </p>
                </div>
                <input
                  id="slider"
                  type="range"
                  min="20"
                  max="100"
                  margin="0"
                  value={viewDistance}
                  step="1"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="optotyp-calibration">
            <h3>Kalibrace</h3>
            <div className="optotyp-calibration-selection">
              {/* //výběr kalibrace velikosti nebo barvy           */}
              <div className="segmented-control">
                {["Velikost", "Barva"].map((value) => (
                  <button
                    key={value}
                    className={`button-controler ${
                      typeCalibration === value ? "active" : ""
                    }`}
                    onClick={() => setTypeCalibration(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {/* //při výběru kalibrace velikosti určuji typ vzoru           */}
              {typeCalibration === "Velikost" && (
                <div className="segmented-control">
                  {["Karta", "A4", "Euro"].map((value) => (
                    <button
                      key={value}
                      className={`button-controler ${
                        typeCalibrationSample === value ? "active" : ""
                      }`}
                      onClick={() => setTypeCalibrationSample(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="optotyp-calibration-controls">
              <div>
                <button
                  style={{ marginRight: "20px" }}
                  onClick={() => {
                    setSampleWidth(sampleWidth - 1);
                  }}
                >
                  Zmenšit
                </button>

                <button
                  onClick={() => {
                    setSampleWidth(sampleWidth + 1);
                  }}
                >
                  Zvětšit
                </button>
              </div>
              <div
                //velikost platební karty je 8.56 cm x 5.398 cm
                className="optotyp-calibration-sample"
                style={{
                  width: sampleWidth,
                  height: sampleWidth * (5.398 / 8.56),
                }}
              >
                Zde umístěte platební kartu
              </div>
              <p>1 mm odpovídá {(sampleWidth / 85.6).toFixed(2)} px</p>
            </div>
          </div>
        </div>

        <div className="optotyp-right-column">
          <h1>Výběr testů</h1>
          <div className="optotyp-right-column-header">
            <h3>Kategorie testů</h3>
            <OptotypMenu
              actualStartTests={setSelectedTests}
              initialItems={selectedTests}
            />
          </div>
          <div className="optotyp-right-column-buttons">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexFlow: "column",
                marginRight: "120px",
              }}
            >
              <button className="button" onClick={() => handleClickSave()}>
                Uložit
              </button>
              <button className="button" onClick={() => handleClickLoad()}>
                Nahrát
              </button>
            </div>
            <button
              className="button-big"
              onClick={() => handleClickStartButton()}
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
      <div className="optotyp-help">
        <h2>Optotyp Help</h2>
        <p>
          Pro správnou zobrazení optotypů je nutné provést kalibraci. Přiložte
          na obrazovku kreditní kartu (nebo jinou kartu o stejné velikosti) a
          tlačítky ZMENŠIT a ZVĚTŠIT nastavte velikost červeného čtverce tak,
          aby těsně lemoval přiloženou kartu.
        </p>
      </div>
    </div>
  );
}

export default Optotyp;
