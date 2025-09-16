import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Logout from "../login/Logout";
import "./MainMenu.css";
import menuIcon from "../../styles/svg/mirror-line.svg";

const buttons = [
  {
    id: "optotyp",
    label: "Optotyp",
    onClick: () => console.log("Optotyp clicked"),
    rights: 0,
    path: "/optotyp",
  },
  {
    id: "visual-training",
    label: "Zrakový trénink",
    rights: 0,
    path: "/visual-training",
  },
  { id: "clients", label: "Klienti", rights: 1, path: "/" },
];

function MainMenu(prosps) {
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = (button) => {
    setActiveButton(button.id); // změna stylu
    navigate(button.path); // přechod na stránku
  };

  return (
    <div className="main-menu-container">
      <div className="main-menu">
        <div className="main-menu-header">
          <h1>Menu</h1>
          <img className="main-menu-icon" src={menuIcon} alt="Menu"></img>
        </div>
        {console.log("FRNT MainMenu user rights:", user?.rights, user?.name)}
        {buttons.map((button) => {
          // Kontrola práv uživatele
          // user.rights = user.rights || 0; // Zajištění, že rights existují a jsou číslo
          // user.rights = 1; // Zajištění, že rights existují a jsou číslo

          // Pokud není uživatel přihlášen, zobrazíme jen tlačítka s právy 0
          // if (Number(JSON.stringify(user.rights)) >= button.rights)

          if (user?.rights >= button.rights || button.rights === 0) {
            return (
              <button
                key={button.id}
                id={button.id}
                className={`button-main-menu ${
                  activeButton === button.id ? "active" : ""
                }`}
                onClick={() => handleClick(button)}
              >
                {button.label}
              </button>
            );
          }
          return null; // Pokud uživatel nemá práva, tlačítko se nezobrazí
        })}
      </div>
      <div className="main-menu-footer">
        {user?.name && <div className="main-menu-avatar"></div>}
        {user?.name && (
          <div className="main-menu-user-info">
            <p>
              {user?.name} ({user?.rights})
            </p>
            <a href="/logout">
              <p>Odhlásit</p>
            </a>
          </div>
        )}
        {!user?.name && (
          <div className="main-menu-user-info">
            <p>(nepřihlášen)</p>
            <a href="/">
              <p>Přihlásit</p>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainMenu;
