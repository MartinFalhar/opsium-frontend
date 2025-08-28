import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Optotyp.css";
import { useUser } from "../../context/UserContext";

function Optotyp() {
  const cardWidth = 8.56; //size of credit card in cm
  const cssPx = cardWidth * (96 / 2.54);      // ≈ 323.53
  const devicePx = cssPx * window.devicePixelRatio;
  

  const [hodnota, setHodnota] = useState(100);
  const [sampleWidth, setSampleWidth] = useState(devicePx);  // initial value in pixels
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = (button) => {
    console.log("Optotyp clicked");
    navigate("/optotyp-testing"); // přechod na stránku
  };

  const handleChange = (e) => {
    setHodnota(e.target.value); // uložíme hodnotu slideru do stavu
  };

  return (
    <div className="optotyp-container">
      <div className="optotyp-settings">
      <div className="optotyp-left-column">
        <h2>Optotyp Settings</h2>

      {user ? (        <p>
          Přihlášen: {user.name} ({user.rights})
        </p>
      ) : (
        <p>Nepřihlášený uživatel</p>
      )}
        <div>
          <h3>Vzdálenost od obrazovky</h3>
          <label htmlFor="slider">
            Vzdálenost od obrazovky: {hodnota / 10} metrů
          </label>
          <input
            id="slider"
            type="range"
            min="30"
            max="100"
            value={hodnota}
            step="1"
            onChange={handleChange}
          />
          <p>Akomodační zátěž: {(10 / hodnota).toFixed(2)} [D]</p>
        </div>
      <div className="optotyp-calibration">
        <h3>Kalibrace</h3>
        <p>
          Pro správnou funkci aplikace je nutné provést kalibraci. Umístěte se
          do vzdálenosti {hodnota / 10} metrů od obrazovky a změřte skutečnou
          velikost zobrazeného čtverce pomocí pravítka.
        </p>
        <p>
          Zadejte naměřenou velikost do pole níže (v centimetrech) a potvrďte
          tlačítkem "Kalibrovat".
        </p>
        <div className="optotyp-calibration-controls">

        <button 
        onClick={() => {setSampleWidth(sampleWidth - 1)}}
        className="optotyp-calibration-btn-shrink">Zmenšit</button>
        <button 
        onClick={() => {setSampleWidth(sampleWidth + 1)}}className="optotyp-calibration-btn-expand">Zvětšit</button>
        </div>
        <div 
        //velikost platební karty je 8.56 cm x 5.398 cm
        className="optotyp-calibration-sample" style = {{width:sampleWidth,
          height: sampleWidth * (5.398/8.56)
        }}>Zde umístěte platební kartu</div>
  <p>1 cm odpovídá {(sampleWidth/8.56).toFixed(2)} px</p>
      </div>


        </div>
        <div className="optotyp-middle-column">
          <h3>Middle column</h3>
        </div>
        <div className="optotyp-right-column">
          <button className="button-big" onClick={() => handleClick()}>
            Start Test
          </button>
        </div>
      </div>
      <div className="optotyp-help">
        <h2>Optotyp Help</h2>
      </div>
    </div>
  );
}

export default Optotyp;
