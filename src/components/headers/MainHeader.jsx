import React, { useEffect, useState } from "react";
import OpsiumLogo from "../../styles/images/opsium-logo-gray.png"; // Adjust the path as necessary
import "./MainHeader.css";



function MainHeader() {
  // const navigate = useNavigate();

  const [time, setTime] = useState(new Date());




  // const handleLogoClick = () => {
  //   navigate("/"); // Navigate to the home page when the logo is clicked
  // };
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
    day: "numeric",  // např. 6
    month: "long",   // např. července
  });

  // Formát času HH:MM
  const formattedTime = time.toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="layout-header">
      {/* <img
        alt="Opsium logo"
        src={OpsiumLogo}
        style={{ width: "130px", objectFit: "contain", paddingLeft: "20px" }}
        onClick={handleLogoClick}
        className="header-logo"
      ></img>*/}
    <div className="time_day_conatiner">
      <p className="time">{formattedTime }</p>
      <p className="day_of_week">
        {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
      </p>  
    </div>

    </header>
  );
}

export default MainHeader;
