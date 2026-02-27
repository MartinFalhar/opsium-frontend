import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

import "./Settings.css";

import SettingsDashboard from "./SettingsDashboard";
import SettingsAccount from "./SettingsAccount";
import SettingsData from "./SettingsData";
import SettingsPassword from "./SettingsPassword";
import SettingsSubUser from "./SettingsSubUser";
import SettingsLogout from "./SettingsLogout";
import MenuToggleIcon from "../../components/icons/MenuToggleIcon";

const API_URL = import.meta.env.VITE_API_URL;

function Settings(props) {
  const [isMenuExtended, setIsMenuExtended] = useState(true);

  const buttons = [
    {
      id: "1",
      label: "Nastavení účtu",
      rights: 0,
      component: SettingsAccount,
      icon: "eye",
    },
    {
      id: "2",
      label: "ODHLÁSIT SE",
      rights: 0,
      component: SettingsLogout,
      icon: "eye",
    },
  ];

  //nastavuje komponentu z menu
  const [menuComponent, setMenuComponent] = useState(null);

  //předává data přihlášeného uživatele
  const { user } = useUser();

  //nutné pro správnou manipulaci s komponentou menu
  const Component = menuComponent;

  //zachycení kliku na tlačítko menu
  const [activeButton, setActiveButton] = useState(null);

  //handling kliků na tlačítka menu
  const handleClick = (button) => {
    setActiveButton(button.id);
    setMenuComponent(() => button.component);
  };

  useEffect(() => {
    // const loadClients = async () => {
    //   const res = await fetch(`${API_URL}/clients`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ clients }),
    //   });
    //   const data = await res.json();
    //   if (res.ok) {
    //     setClients(data);
    //   } else {
    //     setError(data.message);
    //   }
    // };
    // loadClients();
    handleClick(buttons[0]);
  }, []);

  return (
    <div className="container">
      <div
        className="secondary-menu"
        style={{
          width: isMenuExtended ? "200px" : "60px",
        }}
      >
        <div className="secondary-menu-header">
          {isMenuExtended ? <h1>Můj účet</h1> : ""}
          <MenuToggleIcon
            onClick={() => {
              setIsMenuExtended(!isMenuExtended);
            }}
            className="secondary-menu-icon"
            alt="Menu"
          />
        </div>
        {buttons.map((button) => {
          return (
            <button
              key={button.id}
              id={button.id}
              style={{
                width: isMenuExtended ? "200px" : "60px",
              }}
              className={`button-secondary-menu ${
                activeButton === button.id ? "active" : ""
              } ${button.icon}`}
              onClick={() => handleClick(button)}
            >
              {isMenuExtended ? button.label : ""}
            </button>
          );
        })}
      </div>
      <div className="left-container">
        {Component ? <Component client={user} /> : null}
      </div>
    </div>
  );
}

export default Settings;
