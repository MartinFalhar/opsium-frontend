import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

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

  console.log("FRNT MainMenu user:", user);

  return (
    <div className="main-menu-container">
      <div className="main-menu">
        <h1>Menu</h1>
        {buttons.map((button) => {
          // Kontrola práv uživatele
          // user.rights = user.rights || 0; // Zajištění, že rights existují a jsou číslo
          // user.rights = 1; // Zajištění, že rights existují a jsou číslo

          // Pokud není uživatel přihlášen, zobrazíme jen tlačítka s právy 0
          // if (Number(JSON.stringify(user.rights)) >= button.rights)
          console.log("FRNT MainMenu user rights:", user?.rights);
          if (user?.rights >= button.rights) {
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
        <div className="main-menu-avatar"></div>
        <div className="main-menu-user-info">
          <p>
            {user?.name} ({user?.rights})
          </p>
          <a href="">
            <p>Odhlásit</p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
