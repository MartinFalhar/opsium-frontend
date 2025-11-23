import React, { useEffect, useState } from "react";
import OpsiumLogo from "../../styles/images/opsium-logo-gray.png"; // Adjust the path as necessary
import "./MainHeader.css";
// import { useHeaderClients } from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import closeIcon from "../../styles/svg/close.svg";

function MainHeader() {
  // const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [activeMember, setActiveMember] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  //bere ID parametr z URL
  const location = useLocation();
  const navigate = useNavigate();

  const { members, headerClients, setHeaderClients, setActiveId } = useUser();

  const handleClientLayout = (clientID) => {
    // set active client id in global context (DB id)

    setActiveId((prev) => ({
      ...prev,
      id_client: 123,
    }));

    setActiveItemId(clientID);
    navigate(`/client/${clientID}`);
  };

  // synchronizuje klienta v URL s aktivním klientem v headeru
  useEffect(() => {
    if (!location || !location.pathname) return;
    const match = location.pathname.match(/\/client\/(.+)$/);
    if (match) {
      const idFromUrl = match[1];
      // prefer number when possible
      const parsed = isNaN(Number(idFromUrl)) ? idFromUrl : Number(idFromUrl);
      setActiveItemId(parsed);

      setActiveId((prev) => ({
        ...prev,
        id_client: parsed,
      }));
    }
  }, [location.pathname, headerClients]);

  useEffect(() => {
    setActiveMember(members[0]);
    console.log("Members:", members);
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
    setActiveId((prev) => ({
      ...prev,
      id_member: member.id,
    }));

    setActiveMember(member);
    console.log;
    `Selected member ID: ${member.id}`;
    setShowMemberModal(false);
  };

  const handleDelete = (e, id) => {
    //Zastavení EVENTU nadřazeného prvku - BUBBLING PARENT PREVENTION
    e?.stopPropagation();
    const updateHeaderClients = headerClients.filter((c) => c.id !== id);

    // Nejdřív přesměrujeme, až pak změníme stav
    //Pokud je ještě někdo na pracovní ploše, zvolíme ho

    if (updateHeaderClients.length > 0 && location.pathname !== "/clients") {
      setHeaderClients(updateHeaderClients);

      // Počkáme na dokončení navigace před změnou stavu
      setTimeout(() => {
        handleClientLayout(updateHeaderClients[0].id);
      }, 0);
    } else {
      // navigate to clients list when there are no clients left
      navigate("/clients");
      setHeaderClients(updateHeaderClients);
    }
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

      {headerClients.length === 0 && (
        <p className="p-empty-info">
          {`${
            headerClients.length === 0 ? "< Pracovní pole je prázdné >" : ""
          }`}
        </p>
      )}

      <div className="header-clients-list">
        {headerClients.length > 0 &&
          headerClients.map((client) => {
            return (
              <div
                key={client.id}
                className={`header-client-item ${
                  activeItemId === client.id &&
                  location.pathname.includes("/client/")
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setActiveItemId(client.id);
                  handleClientLayout(client.id);
                }}
                onMouseEnter={() => setHoveredItemId(client.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <p>
                  <strong>{`${client.degree_before} ${client.name} ${client.surname}, ${client.degree_after}`}</strong>{" "}
                </p>

                <p>{`${client.street}, ${client.city} (${client.id}/${client.id_organizations})`}</p>
                {/* <p>
                  {activeItemId === client.id
                    ? `nar.: ${new Date(client.birth_date).toLocaleDateString(
                        "cs-CZ"
                      )}`
                    : ""}
                </p> */}

                {hoveredItemId === client.id && (
                  <div className="deleteSign">
                    <img
                      src={closeIcon}
                      alt="Close"
                      onClick={(e) => handleDelete(e, client.id)}
                    />
                  </div>
                )}
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
            <h2>Vyber člena</h2>
            {members?.map((member) => (
              <div
                key={member.id}
                className="modal-member-item"
                onClick={() => handleMemberSelect(member)}
              >
                {member.name} {member.surname}
              </div>
            ))}
            <p className="modal-pin-info">Kontrola PINem není aktivní</p>
          </div>
        </div>
      )}
    </header>
  );
}

export default MainHeader;
