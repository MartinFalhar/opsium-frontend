import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Optotyp.css";
import { useUser } from "../../context/UserContext";

function Optotyp() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = (button) => {
    console.log("Optotyp clicked");
    navigate("/optotyp-testing"); // přechod na stránku
  };

  return (
    <div className="optotyp-container">
      <div className="optotyp-settings">
        <h2>Optotyp Settings</h2>
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
