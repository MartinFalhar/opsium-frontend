import { useParams } from "react-router-dom";
import { useHeaderClients } from "../../context/UserContext";
import "./Client.css";
import { useState } from "react";
import menuIcon from "../../styles/svg/mirror-line.svg";
import ClientDashboard from "../client-dashboard/ClientDashboard";
import ClientInvoices from "../client-invoices/ClientInvoices";
import ClientVisTraining from "../client-vis-training/ClientVisTraining";
import ClientOptometry from "../client-optometry/ClientOptometry";
import ClientLab from "../client-lab/ClientLab";

function Client() {
  const buttons = [
    {
      id: "1",
      label: "Přehled",
      rights: 0,
      component: ClientDashboard,
      icon: "clients",
    },
    {
      id: "2",
      label: "Objednávky",
      onClick: () => console.log("Invoices clicked"),
      rights: 0,
      component: ClientInvoices,
      icon: "optotyp",
    },
    {
      id: "3",
      label: "Optometrie",
      rights: 0,
      component: ClientOptometry,
      icon: "eye",
    },
    {
      id: "4",
      label: "Trénink",
      rights: 0,
      component: ClientVisTraining,
      icon: "eye",
    },
    {
      id: "5",
      label: "Laboratoř",
      rights: 0,
      component: ClientLab,
      icon: "eye",
    },
  ];

  const { id } = useParams();
  const [menuComponent, setMenuComponent] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const { headerClients } = useHeaderClients();
  // Načti klienta např. z kontextu nebo databáze
  const client = headerClients.find((c) => c.id === parseInt(id));

  const handleClick = (button) => {
    setActiveButton(button.id);
    setMenuComponent(() => button.component);
  };

  const Component = menuComponent;

  return (
    <div className="client-container">
      <div className="client-menu">
        <div className="client-menu">
          <div className="client-menu-header">
            <h1>Klient</h1>
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
        {Component ? <Component client={client} /> : null}
      </div>

    </div>
  );
}

export default Client;
