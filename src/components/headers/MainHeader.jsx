import React, { useEffect, useState } from "react";
import OpsiumLogo from "../../styles/images/opsium-logo-gray.png"; // Adjust the path as necessary
import "./MainHeader.css";
import { useHeaderClients } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function MainHeader() {
  // const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const { headerClients } = useHeaderClients();

  // const handleLogoClick = () => {
  //   navigate("/"); // Navigate to the home page when the logo is clicked
  // };

  const handleClientLayout = (clientID) => {
    // Navigate(`/clients/layout/${clientId}`);
    navigate(`/client/${clientID}`);
  };

  useEffect(() => {
    // Nastaví interval na 1 minutu (60 000 ms)
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    // Okamžitá aktualizace při načtení (abychom nečekali 1. minutu)
    setTime(new Date());

    // Vyčištění při odpojení komponenty
    return () => clearInterval(interval);
  }, []);

  // Formát dne a datumu v češtině
  const formattedDate = time.toLocaleDateString("cs-CZ", {
    weekday: "long", // např. středa
    day: "numeric", // např. 6
    month: "long", // např. července
  });

  // Formát času HH:MM
  const formattedTime = time.toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log("Header clients:", headerClients);
  return (
    <header className="layout-header">
      {/* <img
        alt="Opsium logo"
        src={OpsiumLogo}
        style={{ width: "130px", objectFit: "contain", paddingLeft: "20px" }}
        onClick={handleLogoClick}
        className="header-logo"
      ></img>*/}
      <div className="time_day_container">
        <p className="time">{formattedTime}</p>
        <p className="day_of_week">
          {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
        </p>
      </div>
      <div className="spacer"></div>
      {headerClients.length > 0 &&
        headerClients.map((client) => {
          // const client = item.client;
          return (
            <div
              key={client.id}
              className="header-client-item"
              onClick={() => handleClientLayout(client.id)}
            >
              <p>{`${client.degree_front} ${client.name} ${client.surname} ${client.degree_post}`}</p>
              <p>{`${client.street}, ${client.city}`}</p>
            </div>
          );
        })}
    </header>
  );
}

export default MainHeader;
