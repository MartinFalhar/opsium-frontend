import React, { useEffect } from "react";
import { useState } from "react";
import "./Store.css";
import { useUser } from "../../context/UserContext";
import menuIcon from "../../styles/svg/mirror-line.svg";
import StoreLens from "./StoreLens.jsx";
import StoreSunglasses from "./StoreSunglasses.jsx";
import StoreContactLens from "./StoreCL.jsx";
import StoreSolutionsDrops from "./StoreSoldrops.jsx";
import StoreGoods from "./StoreGoods.jsx";

function Store() {
  const buttons = [
    {
      id: "1",
      label: "Brýle",
      rights: 0,
      component: StoreLens,
      icon: "optician",
    },
    {
      id: "2",
      label: "Sluneční brýle",
      rights: 0,
      component: StoreSunglasses,
      icon: "optometry",
    },
    {
      id: "3",
      label: "Brýlové čočky",
      rights: 0,
      component: StoreContactLens,
      icon: "ico",
    },
    {
      id: "4",
      label: "Kontaktní čočky",
      rights: 0,
      component: StoreContactLens,
      icon: "ico",
    },
    {
      id: "5",
      label: "Roztoky a kapky",
      rights: 0,
      component: StoreSolutionsDrops,
      icon: "ico",
    },
    {
      id: "6",
      label: "Hotové zboží",
      rights: 0,
      component: StoreGoods,
      icon: "ico",
    },
  ];

  const [isMenuExtended, setIsMenuExtended] = useState(true);

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
          {isMenuExtended ? <h1 style={{ paddingLeft: "20px" }}>SKLAD</h1> : ""}
          {/* Ikona na sbalení menu - momentálně bez funkce */}
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

export default Store;
