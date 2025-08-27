import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Optotyp.css";
import { useUser } from "../../context/UserContext";

function Optotyp() {
  const [hodnota, setHodnota] = useState(100);
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
        <h2>Optotyp Settings</h2>
        <div>
          <label htmlFor="slider">
            Vzdálenost od obrazovky {hodnota / 10} metrů
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
          <p>Akomodační náročnost: {(10 / hodnota).toFixed(2)} [D]</p>
        </div>
        {user ? (
          <p>
            Přihlášen: {user.name} ({user.rights})
          </p>
        ) : (
          <p>Nepřihlášený uživatel</p>
        )}
        <button className="button-big" onClick={() => handleClick()}>
          Start Test
        </button>
      </div>
      <div className="optotyp-help">
        <h2>Optotyp Help</h2>
      </div>
    </div>
  );
}

export default Optotyp;
