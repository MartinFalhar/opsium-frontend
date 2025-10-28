import React, { useEffect, useState } from "react";
import OpsiumLogo from "../../styles/images/opsium-logo-gray.png"; // Adjust the path as necessary
import "./MainHeader.css";
// import { useHeaderClients } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function MainHeader() {
  // const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [activeMember, setActiveMember] = useState(null);
  const navigate = useNavigate();

  const { members, headerClients } = useUser();

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
  const getInitials = (name, surname) => {
    const first = name?.charAt(0)?.toUpperCase() || "";
    const last = surname?.charAt(0)?.toUpperCase() || "";
    return first + last;
  };

  const handleMemberClick = () => {
    setShowMemberModal(true);
  };

  const handleMemberSelect = (member) => {
    setActiveMember(member);
    setShowMemberModal(false);
  };

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
      <div className="header-clients-list">
        {headerClients.length > 0 &&
          headerClients.map((client) => {
            // const client = item.client;
            return (
              <div
                key={client.id}
                className="header-client-item"
                onClick={() => handleClientLayout(client.id)}
              >
                <p><strong>{`${client.degree_front} ${client.name} ${client.surname} ${client.degree_post}`}</strong></p>
                <p>{`${client.street}, ${client.city}`}</p>
              </div>
            );
          })}
      </div>
      {/* <div className="members-list">
        {members?.map((member) => (
          <div key={member.id}>
            <h4>{member.name}</h4>
          </div>
        ))}
      </div> */}

      {/* Members initials */}
      <div className="members-list">
        {activeMember ? (
          <div
            className="member-avatar"
            onClick={handleMemberClick}
            title={`${activeMember.name} ${activeMember.surname}`}
          >
            {getInitials(activeMember.name, activeMember.surname)}
          </div>
        ) : (
          members?.[0] && (
            <div
              className="member-avatar"
              onClick={handleMemberClick}
              title={`${members[0].name} ${members[0].surname}`}
            >
              {getInitials(members[0].name, members[0].surname)}
            </div>
          )
        )}
      </div>

      {/* Modal for selecting another member */}
      {showMemberModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowMemberModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Vyber člena</h3>
            {members?.map((member) => (
              <div
                key={member.id}
                className="modal-member-item"
                onClick={() => handleMemberSelect(member)}
              >
                {member.name} {member.surname}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default MainHeader;
