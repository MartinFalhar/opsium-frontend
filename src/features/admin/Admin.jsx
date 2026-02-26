import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

import "./Admin.css";

import AdminDashboard from "./AdminDashboard";
import AdminOrganization from "./AdminOrganization";
import AdminAccounts from "./AdminAccounts";
import AdminMembers from "./AdminMembers";
import AdminBranches from "./AdminBranches";
import MenuToggleIcon from "../../components/icons/MenuToggleIcon";

import adminIcon from "../../styles/svg/ai.svg";

const API_URL = import.meta.env.VITE_API_URL;

function Admin() {
  const [isMenuExtended, setIsMenuExtended] = useState(true);

  const buttons = [
    {
      id: "1",
      label: "Přehled",
      rights: 0,
      component: AdminDashboard,
      icon: "dashboard",
    },
    {
      id: "2",
      label: "Organizace",
      rights: 0,
      component: AdminOrganization,
      icon: "invoices",
    },
    {
      id: "3",
      label: "Účty",
      rights: 0,
      component: AdminAccounts,
      icon: "accounts",
    },
    {
      id: "4",
      label: "Pobočky",
      rights: 0,
      component: AdminBranches,
      icon: "catalog",
    },
    {
      id: "5",
      label: "Členové",
      rights: 0,
      component: AdminMembers,
      icon: "person",
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
      <div
        className="secondary-menu"
        style={{
          width: isMenuExtended ? "200px" : "60px",
        }}
      >
        <div className="secondary-menu-header">

          {isMenuExtended ? (
            <>
              <img
                className="secondary-menu-icon"
                src={adminIcon}
                alt="Admin"
              ></img>
              <h1 className="fancy-3">ADMIN</h1>
            </>
          ) : null}
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
      <div className="left-container-2">
        {Component ? <Component client={user} /> : null}
      </div>
    </div>
  );
}

export default Admin;
