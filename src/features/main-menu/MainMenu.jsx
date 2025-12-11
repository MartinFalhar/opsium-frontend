import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Logout from "../settings/SettingsLogout";
import "./MainMenu.css";
import menuIcon from "../../styles/svg/mirror-line.svg";

const login_button = {
  id: "login",
  label: "Přihlásit se",
  rights: 0,
  path: "/",
  pathLogged: "/settings",
  icon: "login",
};

const buttons = [
  {
    id: "dashboard",
    label: "Přehled",
    rights: 1,
    path: "/dashboard",
    icon: "dashboard",
  },
  {
    id: "clients",
    label: "Klienti",
    rights: 1,
    path: "/clients",
    icon: "clients",
  },
  {
    id: "invoices",
    label: "Zakázky",
    rights: 1,
    path: "/invoices",
    icon: "catalog",
  },
  {
    id: "cashdesk",
    label: "Pokladna",
    rights: 1,
    path: "/cashdesk",
    icon: "shop",
  },
  {
    id: "asistent",
    label: "Asistent",
    rights: 1,
    path: "/assistant",
    icon: "assistant",
  },
  {
    id: "store",
    label: "Sklad",
    rights: 1,
    path: "/store",
    icon: "box",
  },
  {
    id: "catalog",
    label: "Katalog",
    rights: 1,
    path: "/catalog",
    icon: "catalog",
  },
  {
    id: "insurance",
    label: "Pojišťovna",
    rights: 1,
    path: "/insurance",
    icon: "insurance",
  },
  {
    id: "agenda",
    label: "Agenda",
    rights: 1,
    path: "/agenda",
    icon: "dashboard",
  },
  {
    id: "optotyp",
    label: "Optotyp",
    onClick: () => console.log("Optotyp clicked"),
    rights: 0,
    path: "/optotyp",
    icon: "optotyp",
  },
  {
    id: "admin",
    label: "Admin",
    rights: 10,
    path: "/admin",
    icon: "admin",
  },
  {
    id: "superadmin",
    label: "SUPERADMIN",
    rights: 999,
    path: "/superadmin",
    icon: "superadmin",
  },
];

function MainMenu({ isMenuExtended, setIsMenuExtended }) {
  //state evidence pro změnu stylu
  const [activeButton, setActiveButton] = useState("login");
  const navigate = useNavigate();
  //práce s parametry uživatele
  const { user } = useUser();
  const location = useLocation();

  const handleClick = (button) => {
    // změna stylu
    setActiveButton(button.id);
    // přechod na stránku
    navigate(
      button.id === "login"
        ? user?.name
          ? button.pathLogged
          : button.path
        : button.path
    );
  };

  useEffect(() => {
    //pokud je uživatel přihlášen, automaticky otevřít klienty
    if (user?.name) {
      handleClick(buttons[0]);
    }
  }, [user]);

    useEffect(() => {
    //pokud je uživatel přihlášen, automaticky otevřít klienty
    if (location.pathname.includes("client")) {
      setActiveButton("clients");}
  }, [location]);

  return (
    <div className="main-menu-container">
      <div className="main-menu">
        <div className="main-menu-header">
          {isMenuExtended ? <h1 style={{ paddingLeft: "20px" }}>Menu</h1> : ""}
          <img
            onClick={() => {
              setIsMenuExtended(!isMenuExtended);
            }}
            className="main-menu-icon"
            src={menuIcon}
            alt="Menu"
          ></img>
        </div>
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
                  width: isMenuExtended ? "200px" : "60px",
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

      <div className="main-menu-footer"
                style={{
            width: isMenuExtended ? "" : "60px",
          }}>
        <button
          key={login_button.id}
          id={login_button.id}
          style={{
            width: isMenuExtended ? "200px" : "60px",
          }}
          className={`button-main-menu ${
            activeButton === login_button.id ? "active" : ""
          } ${!user?.name ? login_button.icon : "settings"}`}
          onClick={() => handleClick(login_button)}
        >
          {/* {user?.name && <div className="main-menu-avatar"></div>} */}

          {user?.name && isMenuExtended && (
            <div className="main-menu-user-info">
              <p>
                {user?.name} ({user?.rights})
              </p>
            </div>
          )}

          {!user?.name && (isMenuExtended ? login_button.label : "")}
        </button>

        {/* {user?.name && <div className="main-menu-avatar"></div>}
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
        )} */}
      </div>
    </div>
  );
}

export default MainMenu;
