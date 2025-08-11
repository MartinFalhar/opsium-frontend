import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Optotyp.css";

function Optotyp() {
  const navigate = useNavigate();

  const handleClick = (button) => {
    console.log("Optotyp clicked");
    navigate("/optotyp-testing"); // přechod na stránku
  };

  return (
    <div className="optotyp-container">
      <div className="optotyp-settings">
        <h2>Optotyp Settings</h2>
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
