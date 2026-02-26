import React from "react";
import { useEffect, useState } from "react";
import "./Agenda.css";
import Modal from "../../components/modal/Modal.jsx";

import { useUser } from "../../context/UserContext";

import AgendaBenefits from "./AgendaBenefits.jsx";
import AgendaContacts from "./AgendaContacts.jsx";
import AgendaDefects from "./AgendaDefects.jsx";
import AgendaOvertime from "./AgendaOvertime.jsx";
import AgendaSalesAction from "./AgendaSalesAction.jsx";
import AgendaServices from "./AgendaServices.jsx";
import AgendaEmail from "./AgendaEmail.jsx";
import AgendaSMS from "./AgendaSMS.jsx";
import MenuToggleIcon from "../../components/icons/MenuToggleIcon";


const API_URL = import.meta.env.VITE_API_URL;

function Agenda() {
  const [isMenuExtended, setIsMenuExtended] = useState(true);

  const buttons = [
    {
      id: "1",
      label: "KONTAKTY",
      rights: 0,
      component: AgendaContacts,
      icon: "clients",
    },
    {
      id: "2",
      label: "Benefity",
      rights: 0,
      component: AgendaBenefits,
      icon: "eye",
    },
    {
      id: "3",
      label: "Výrobní zlomy",
      rights: 0,
      component: AgendaDefects,
      icon: "eye",
    },
    {
      id: "4",
      label: "Přesčasy",
      rights: 0,
      component: AgendaOvertime,
      icon: "eye",
    },
    {
      id: "5",
      label: "Prodejní akce",
      rights: 0,
      component: AgendaSalesAction,
      icon: "eye",
    },
    {
      id: "6",
      label: "Poslat email",
      rights: 0,
      component: AgendaEmail,
      icon: "eye",
    },
    {
      id: "7",
      label: "Poslat SMS",
      rights: 0,
      component: AgendaSMS,
      icon: "eye",
    },
    {
      id: "8",
      label: "Ceník výkonů",
      rights: 0,
      component: AgendaServices,
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
      <div
        className="secondary-menu"
        style={{
          width: isMenuExtended ? "200px" : "60px",
        }}
      >
        <div className="secondary-menu-header">
          {isMenuExtended ? <h1>Agenda</h1> : ""}
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

export default Agenda;
