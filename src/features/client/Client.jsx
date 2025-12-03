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
import LoadExamsListFromDB from "../../components/optometry/LoadExamsListFromDB";

function Client() {
  //definice sekundárního MENU
  const clientMenu = [
    {
      id: 1,
      label: "Přehled",
      rights: 0,
      component: ClientDashboard,
      icon: "dashboard",
    },
    {
      id: 2,
      label: "Optometrie",
      rights: 0,
      component: ClientOptometry,
      icon: "optometry",
    },
    {
      id: 3,
      label: "Objednávky",
      onClick: () => console.log("Invoices clicked"),
      rights: 0,
      component: ClientInvoices,
      icon: "invoices",
    },
    {
      id: 4,
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

  //bere ID parametr z URL adresy
  const { id } = useParams();

  const [menuComponent, setMenuComponent] = useState(null);
  const [activeSecondaryButton, setActiveSecondaryButton] = useState(null);
  const [activeTertiaryButton, setActiveTertiaryButton] = useState(null);
  const { user, activeId, headerClients, setHeaderClients } = useUser();
  const [examMenuList, setExamMenuList] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [notSavedDetected, setNotSavedDetected] = useState(false);
  const [showExams, setShowExams] = useState(false);

  const navigate = useNavigate();

  // Načti klienta z headerClients, ID načtené skrz useParams je
  //vždy STRING, proto PARSEINT
  const client = headerClients?.find((c) => c?.id === parseInt(id));

  useEffect(() => {
    // Pokud nemáme headerClients nebo klienta, přesměrujeme na CLIENTS - nastává po smazání klienta z HEADER zóny
    if (!headerClients?.length || !client) {
      navigate("/clients");
      return;
    }
    console.log(
      `START CLIENT.activeSecondaryButton`,
      client.activeSecondaryButton
    );

    // Nastavíme výchozí sekundárního MENU jen pokud máme platná data
    console.log(`START activeSecondaryButton PAGE LOAD`, activeSecondaryButton);

    if (client.activeSecondaryButton === null) {
      setMenuComponent(() => clientMenu[0].component);
      setActiveSecondaryButton(clientMenu[0].id);
      setHeaderClients((prev) =>
        prev.map((c) =>
          c.id === client.id ? { ...c, activeSecondaryButton: 1 } : c
        )
      );
    } else {
      setMenuComponent(
        () => clientMenu[client.activeSecondaryButton - 1].component
      );
      setActiveSecondaryButton(clientMenu[client.activeSecondaryButton - 1].id);
    }
  }, [id, navigate]);

  useEffect(() => {
    const loadExams = async () => {
      if (!activeId.id_client || !user.branch_id) return;

      setLoadingExams(true);

      try {
        //načte seznam examů (name) pro daného klienta a pobočku
        const data = await LoadExamsListFromDB(
          activeId.id_client,
          user.branch_id
        );
        // najdeme klienta jen jednou
        const client = headerClients?.find((c) => c.id === activeId.id_client);
        let finalList = [...data];
        //pokud je to prvotní načtení, přidá na začátek položku (neuloženo)

        // pokud klient ještě NEMÁ activeTertiaryButton nastavený
        if (
          (client && client.activeTertiaryButton === null) ||
          client.notSavedDetected
        ) {
          finalList = [{ name: "(neuloženo)" }, ...finalList];
          // nastavíme globální stav – ale to NESMÍ spouštět celý effect znovu
          setHeaderClients((prev) =>
            prev.map((c) =>
              c.id === client.id
                ? {
                    ...c,
                    activeTertiaryButton:
                      client.activeTertiaryButton === null
                        ? 0
                        : c.activeTertiaryButton,
                    notSavedDetected: true,
                  }
                : c
            )
          );
        }

        // přidání id/key
        finalList = finalList.map((exam, index) => ({
          ...exam,
          id: index,
          key: index,
        }));
        setExamMenuList(finalList);
        setTimeout(() => setShowExams(true), 50);
        console.log("Loaded examMenuList:", JSON.stringify(examMenuList));
      } catch (err) {
        console.error("Chyba při načítání examMenuList:", err);
      } finally {
        setLoadingExams(false);
      }
    };

    if (client.activeSecondaryButton === 2) {
      loadExams();
    }
  }, [
    activeId.id_client,
    user.branch_id,
    client.activeSecondaryButton,
    client.notSavedDetected,
  ]);

  //obsluha sekundárního MENU
  const handleClick = (button) => {
    setActiveSecondaryButton(button.id);

    setMenuComponent(() => button.component);

    const client = headerClients?.find((c) => c.id === activeId.id_client);

    setHeaderClients((prev) =>
      prev.map((c) =>
        c.id === client.id ? { ...c, activeSecondaryButton: button.id } : c
      )
    );
    console.log(`client.activeSecondaryButton`, client.activeSecondaryButton);
  };

  //obsluha terciárního MENU - seznam examů
  const handleClickExamList = (examId) => {
    // setActiveTertiaryButton(examId.id);
    //do aktivn9ho CLIENTa uložím do jeho vlastností polohu tertiárního menu
    const client = headerClients?.find((c) => c.id === activeId.id_client);
    setHeaderClients((prev) =>
      prev.map((c) =>
        c.id === client.id
          ? { ...c, activeTertiaryButton: examId.id, examName: examId.name }
          : c
      )
    );
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
            <div key={button.id}>
              <button
                id={button.id}
                className={`button-secondary-menu ${
                  activeSecondaryButton === button.id ? "active" : ""
                } ${button.icon}`}
                onClick={() => handleClick(button)}
              >
                {button.label}
              </button>
              {button.id === activeSecondaryButton &&
              activeSecondaryButton === 2 &&
              !loadingExams &&
              examMenuList.length > 0
                ? examMenuList.map((exam, index) => (
                    <button
                      style={{ transitionDelay: `${index * 0.05}s` }}
                      key={exam.id}
                      id={exam.id}
                      className={`button-tertiary-menu ${
                        showExams ? "show" : ""
                      } ${
                        headerClients?.find((c) => c.id === activeId.id_client)
                          ?.activeTertiaryButton === exam.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        handleClickExamList(exam);
                      }}
                    >
                      {exam.name}
                    </button>
                  ))
                : null}
            </div>
          );
        })}
      </div>
      <div className="left-container">
        {/* {console.log(`XXXCLIENT ${JSON.stringify(client)}`)} */}
        {Component ? <Component client={client} /> : null}
      </div>
    </div>
  );
}

export default Client;
