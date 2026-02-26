import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

import "./Superadmin.css";

import SuperadminDashboard from "./SuperadminDashboard";
import SuperadminAdminPanel from "./SuperadminAdminPanel";
import SuperadminData from "./SuperadminData";
import SuperadminPassword from "./SuperadminPassword";
import SuperadminSubUser from "./SuperadminSubUser";
import SuperadminLogout from "./SuperadminLogout";
import MenuToggleIcon from "../../components/icons/MenuToggleIcon";


const API_URL = import.meta.env.VITE_API_URL;

function Superadmin() {
  const [isMenuExtended, setIsMenuExtended] = useState(true);

  //předává data přihlášeného uživatele
  const { user } = useUser();

  const buttons = [
    {
      id: "1",
      label: "Přehled",
      rights: 0,
      component: SuperadminDashboard,
      icon: "clients",
    },
    {
      id: "2",
      label: "ADMIN panel",
      rights: 0,
      component: SuperadminAdminPanel,
      icon: "eye",
    },
    {
      id: "3",
      label: "Změna údajů",
      rights: 0,
      component: SuperadminData,
      icon: "eye",
    },
    {
      id: "4",
      label: "Změna hesla",
      rights: 0,
      component: SuperadminPassword,
      icon: "eye",
    },
  ];

  //nastavuje komponentu z menu
  const [menuComponent, setMenuComponent] = useState(null);

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
          {isMenuExtended ? <h1>SuperAdmin</h1> : ""}
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
        {Component ? <Component userData={user} /> : null}
      </div>
      <div className="right-container">
        <h1>INFO</h1>
        <p>Jste přihlášen jako SuperAdmin.</p>
        <pre>Organization:{user.organization_id}</pre>
      </div>
    </div>
  );
}

export default Superadmin;
