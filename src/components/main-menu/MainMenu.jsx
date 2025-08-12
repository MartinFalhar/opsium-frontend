import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleClick = (button) => {
    setActiveButton(button.id); // změna stylu
    navigate(button.path); // přechod na stránku
  };

  return (
    <div>
      <h1>Menu</h1>
      {buttons.map((button) => {
        if (prosps.rights >= button.rights) {
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
      })}
    </div>
  );
}

export default MainMenu;
