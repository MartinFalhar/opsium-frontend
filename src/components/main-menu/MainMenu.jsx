import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Logout from "../login/Logout";
import "./MainMenu.css";
import menuIcon from "../../styles/svg/mirror-line.svg";



const buttons = [
  
  { id: "clients", 
    label: "Klienti",
    rights: 1,
    path: "/",
    icon: "clients"
  },
  {
    id: "optotyp",
    label: "Optotyp",
    onClick: () => console.log("Optotyp clicked"),
    rights: 0,
    path: "/optotyp",
    icon: "optotyp"
  },
  {
    id: "visual-training",
    label: "Zrakový trénink",
    rights: 0,
    path: "/visual-training",
    icon: "eye"
  },
];

function MainMenu({isMenuExtended, setIsMenuExtended}) {
  //state evidence pro změnu stylu
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();
  //práce s parametry uživatele
  const { user } = useUser();



  const handleClick = (button) => {
    setActiveButton(button.id); // změna stylu
    navigate(button.path); // přechod na stránku
  };

  return (
    <div className="main-menu-container">
      <div className="main-menu">
        <div className="main-menu-header">
          {isMenuExtended ? <h1 style={{paddingLeft:
          "20px"
          }}>Menu</h1> : ""}
          <img onClick={() => {setIsMenuExtended(!isMenuExtended)}} className="main-menu-icon" src={menuIcon} alt="Menu"></img>
        </div>
        {console.log(`Menu is ${isMenuExtended ? "full" : "shrinked"}`)}
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
                style={{
                  width:isMenuExtended ? "200px" : "60px",

                }}
                className={`button-main-menu ${
                  activeButton === button.id ? "active" : ""
                } ${button.icon}`}
                onClick={() => handleClick(button)}
              >
                {isMenuExtended ? button.label : ""}
              </button>
            );
          }
          return null; // Pokud uživatel nemá práva, tlačítko se nezobrazí
        })}
      </div>
      <div className="main-menu-footer">
        {user?.name && <div className="main-menu-avatar"></div>}
        {user?.name && isMenuExtended && (
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
