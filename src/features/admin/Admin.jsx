import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

import "./Admin.css";


import AdminPanel from "./AdminPanel";
import AdminDashboard from "./AdminDashboard";


import menuIcon from "../../styles/svg/mirror-line.svg";

const API_URL = import.meta.env.VITE_API_URL;

function Admin() {
  const buttons = [
    {
      id: "1",
      label: "Přehled",
      rights: 0,
      component: AdminDashboard,
      icon: "clients",
    },
    {
      id: "2",
      label: "Účty",
      rights: 0,
      component: AdminPanel,
      icon: "eye",
    },
    {
      id: "3",
      label: "Uživatelé",
      rights: 0,
      component: AdminPanel,
      icon: "eye",
    },
    {
      id: "4",
      label: "Pobočky",
      rights: 0,
      component: AdminPanel,
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

    handleClick(buttons[0]);
  }, []);

  return (
    <div className="container">
      <div className="secondary-menu">
        <div className="secondary-menu-header">
          <h1>* ADMIN *</h1>
          <img
            onClick={() => {
              setIsMenuExtended(!isMenuExtended);
            }}
            className="secondary-menu-icon"
            src={menuIcon}
            alt="Menu"
          ></img>
        </div>
        {buttons.map((button) => {
          return (
            <button
              key={button.id}
              id={button.id}
              style={{
                width: "200px",
              }}
              className={`button-secondary-menu ${
                activeButton === button.id ? "active" : ""
              } ${button.icon}`}
              onClick={() => handleClick(button)}
            >
              {button.label}
            </button>
          );
        })}
      </div>
      <div className="left-container">
        {Component ? <Component client={user} /> : null}

      </div>
      <div className="right-container">
        <h1>INFO</h1>
      </div>
    </div>
  );
}

export default Admin;
