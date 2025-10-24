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

import menuIcon from "../../styles/svg/mirror-line.svg";

const API_URL = import.meta.env.VITE_API_URL;

function Superadmin(props) {
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
    {
      id: "5",
      label: "Správa uživatelů",
      rights: 0,
      component: SuperadminSubUser,
      icon: "eye",
    },
    {
      id: "6",
      label: "ODHLÁSIT SE",
      rights: 0,
      component: SuperadminLogout,
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
      <div className="secondary-menu">
        <div className="secondary-menu-header">
          <h1>Můj účet</h1>
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

export default Superadmin;
