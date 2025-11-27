import "./Client.css";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";

import menuIcon from "../../styles/svg/mirror-line.svg";
import ClientDashboard from "./ClientDashboard";
import ClientInvoices from "./ClientInvoices";
import ClientVisTraining from "./ClientVisTraining";
import ClientOptometry from "./ClientOptometry";
import ClientLab from "./ClientLab";
import LoadExamsFromDB from "../../components/optometry/LoadExamFromDB";

function Client() {
  const clientMenu = [
    {
      id: "1",
      label: "Přehled",
      rights: 0,
      component: ClientDashboard,
      icon: "dashboard",
    },
    {
      id: "2",
      label: "Objednávky",
      onClick: () => console.log("Invoices clicked"),
      rights: 0,
      component: ClientInvoices,
      icon: "invoices",
    },
    {
      id: "3",
      label: "Optometrie",
      rights: 0,
      component: ClientOptometry,
      icon: "optometry",
    },
    {
      id: "4",
      label: "Trénink",
      rights: 0,
      component: ClientVisTraining,
      icon: "training",
    },
    {
      id: "5",
      label: "Laboratoř",
      rights: 0,
      component: ClientLab,
      icon: "lab",
    },
  ];

  //bere ID parametr z URL
  const { id } = useParams();
  const [menuComponent, setMenuComponent] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const { user, activeId, headerClients } = useUser();
  const [examMenuList, setExamMenuList] = useState([]);
  const navigate = useNavigate();

  // Načti klienta z headerClients, ID načtené skrz useParams je
  //vždy STRING, proto PARSEINT
  const client = headerClients?.find((c) => c?.id === parseInt(id));

  useEffect(() => {
    // Pokud nemáme headerClients nebo klienta, přesměrujeme na CLIENTS
    if (!headerClients?.length || !client) {
      navigate("/clients");
      return;
    }
    // Nastavíme výchozí sekundárního MENU jen pokud máme platná data
    setMenuComponent(() => clientMenu[0].component);
    setActiveButton(clientMenu[0].id);
  }, [headerClients, client, id, navigate]);

  useEffect(() => {
    const loadExams = async () => {
      if (!activeId.id_client || !user.branch_id) return;

      try {
        const data = await LoadExamsFromDB(activeId.id_client, user.branch_id);
        setExamMenuList(data);
      } catch (err) {
        console.error("Chyba při načítání examMenuList:", err);
      }
    };

    loadExams();
  }, [activeId.id_client, user.branch_id]);

  //obsluha sekundárního MENU
  const handleClick = (button) => {
    setActiveButton(button.id);
    setMenuComponent(() => button.component);
  };

  const Component = menuComponent;
  // console.log("LoadInfo:", activeId.id_client, user.branch_id);
  // const examMenuList = LoadExamsFromDB(activeId.id_client, user.branch_id);
  // console.log("9999Loaded Exams Menu List:", examMenuList);

  return (
    <div className="container">
      <div className="secondary-menu">
        <div className="secondary-menu-header">
          <h1>Klient</h1>
          <img
            onClick={() => {
              // setIsMenuExtended(!isMenuExtended);
            }}
            className="secondary-menu-icon"
            src={menuIcon}
            alt="Menu"
          ></img>
        </div>

        {clientMenu.map((button) => {
          return (
            <>
              <button
                key={button.id}
                id={button.id}
                style={{
                  width: "200px",
                }}
                className={`button-secondary-menu ${
                  activeButton === button.id ? "active" : ""
                } ${button.icon}`}
                onClick={() => handleClick(button)}
              >
                {button.label}
              </button>
              {button.id === "3" && examMenuList?.length > 0
                ? examMenuList.map((exam) => (
                    <button key={exam.id}>{exam.name}</button>
                  ))
                : null}
            </>
          );
        })}
      </div>
      <div className="left-container">
        {Component ? <Component client={client} /> : null}
      </div>
    </div>
  );
}

export default Client;
