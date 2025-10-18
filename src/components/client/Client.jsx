import { useParams } from "react-router-dom";
import { useHeaderClients } from "../../context/UserContext";
import "./Client.css";
import { useState } from "react";
import menuIcon from "../../styles/svg/mirror-line.svg";

function Client() {
  const buttons = [
    {
      id: "clients",
      label: "Přehled",
      rights: 0,
      path: "/clients",
      icon: "clients",
    },
    {
      id: "optotyp",
      label: "Objednávky",
      onClick: () => console.log("Optotyp clicked"),
      rights: 0,
      path: "/optotyp",
      icon: "optotyp",
    },
    {
      id: "visual-training",
      label: "Optometrie",
      rights: 0,
      path: "/visual-training",
      icon: "eye",
    },
    {
      id: "1",
      label: "Trénink",
      rights: 0,
      path: "/visual-training",
      icon: "eye",
    },
    {
      id: "2",
      label: "Laboratoř",
      rights: 0,
      path: "/visual-training",
      icon: "eye",
    },
  ];

  const { id } = useParams();
  const [activeButton, setActiveButton] = useState(null);
  const { headerClients } = useHeaderClients();
  // Načti klienta např. z kontextu nebo databáze
  const client = headerClients.find((c) => c.id === parseInt(id));
  console.log("Client component, id:", id, "client:", client);
  return (
    <div className="client-container">
      <div className="client-menu">
        <div className="client-menu">
          <div className="client-menu-header">
            <img
              onClick={() => {
                setIsMenuExtended(!isMenuExtended);
              }}
              className="client-menu-icon"
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

            return (
              <button
                key={button.id}
                id={button.id}
                style={{
                  width: "200px",
                }}
                className={`button-client-menu ${
                  activeButton === button.id ? "active" : ""
                } ${button.icon}`}
                onClick={() => handleClick(button)}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="client-data">
        <h1 className="">Client Component</h1>
        <h2>{client.name}</h2>
      </div>
    </div>
  );
}

export default Client;
