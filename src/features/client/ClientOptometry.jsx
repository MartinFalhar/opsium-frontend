import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { data } from "react-router-dom";
import { useRef } from "react";
import "./ClientOptometry.css";

const API_URL = import.meta.env.VITE_API_URL;

import PuffLoaderSpinnerDark from "../../components/loader/PuffLoaderSpinnerDark.jsx";

//IMPORT OPTOMETRY COMPONENT
import OptometryAnamnesis from "../../components/optometry/OptometryAnamnesis";
import OptometryNaturalVisus from "../../components/optometry/OptometryNaturalVisus";
import OptometryRefractionARK from "../../components/optometry/OptometryRefractionARK";
import OptometryRefractionFull from "../../components/optometry/OptometryRefractionFull";
import RestoreOptometryItems from "../../components/optometry/RestoreOptometryItems.jsx";
import ConvertOptometryItems from "../../components/optometry/ConvertOptometryItems.jsx";
import SaveOptometryItemsToDB from "../../components/optometry/SaveOptometryItemsToDB.jsx";

function ClientOptometry() {
  const [optometryItems, setOptometryItems] = useState([
    {
      id: "1",
      modul: "1",
      width: "w50",
      component: OptometryAnamnesis,
      values: {
        name: "Anamnéza",
        text: "Požadavek na plnou korekci",
      },
    },
    {
      id: "2",
      modul: "2",
      width: "w25",
      component: OptometryNaturalVisus,
      values: {
        name: "Naturální vizus",
        pV: "1.25",
        lV: "1.25+",
        bV: "2.0++",
        style: 0,
        text: "",
      },
    },
    {
      id: "3",
      modul: "3",
      width: "w25",
      component: OptometryRefractionARK,
      values: {
        name: "OBJEKTIVNÍ refrakce",
        pS: "-1.23",
        pC: "-1.79",
        pA: "179",
        lS: "+6.85",
        lC: "-1.47",
        lA: "123",
        text: "",
      },
    },
    {
      id: "4",
      modul: "3",
      width: "w75",
      component: OptometryRefractionFull,
      values: {
        name: "Refrakce - plný zápis",
        pS: "-3,75",
        pC: "-4,50",
        pA: "180",
        pP: "2,5",
        pB: "90",
        pAdd: "-3,25",
        lS: "+4,50",
        lC: "90",
        lA: "122",
        lP: "2,5",
        lB: "270",
        lAdd: "+2,50",
        pV: "0,63+",
        lV: "0,8+",
        bV: "1,25+",
        style: 0,
        text: "",
      },
    },
    {
      id: "5",
      modul: "3",
      width: "w75",
      component: OptometryRefractionFull,
      values: {
        name: "Refrakce - pohodlná korekce vzhledem k vysokému CYL",
        pS: -3.75,
        pC: -4.5,
        pA: 180,
        pP: 2.5,
        pB: 90,
        pAdd: -3.25,
        lS: +4.5,
        lC: 90,
        lA: 122,
        lP: 2.5,
        lB: 270,
        lAdd: +2.5,
        pV: 0.633,
        lV: 0.83,
        bV: 1.253,
        text: "",
      },
    },
  ]);

  const { user, headerClients, activeId, setHeaderClients } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeItem, setActiveItem] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [optometryRecordName, setOptometryRecordName] = useState("");
  const [date, setDate] = useState(new Date());

  const localSaveTimeoutRef = useRef(null);
  const changeOccuredRef = useRef(false);

  //DEBOUNCE effect

  function saveToLocalStorage(data, clientId) {
    // zrušíme předchozí naplánované uložení
    clearTimeout(localSaveTimeoutRef.current);
    // naplánujeme nové uložení za 1 sekundu
    localSaveTimeoutRef.current = setTimeout(() => {
      changeOccuredRef.current = true;
      const exportObject = ConvertOptometryItems(optometryItems);
      localStorage.setItem(clientId, JSON.stringify(exportObject));
      console.log("Uloženo do localStorage:", exportObject);
    }, 1000);
  }

  //při každé změně optometryItems, optometryRecordName nebo activeId uložíme do localStorage
  //activeID je zde podruhé kvůli případu změny klienta
  useEffect(() => {
    if (!activeId?.id_client) return;
    // připravíme data k uložení
    const dataToSave = {
      name: optometryRecordName,
      data: optometryItems,
    };

    saveToLocalStorage(dataToSave, activeId.id_client);
  }, [optometryItems, optometryRecordName, activeId]);

  //ukládání do DBF pokud je příznak notSavedDetected FALSE
  //ukládá se co 60 sekund
  useEffect(() => {
    const interval = setInterval(async () => {
      //vypisuje stav notSavedDetected aktivní položky menu; pokud je
      //stále TRUE, znamená to, že záznam ještě nebyl nidky uložen
      //a ukládá se pouze do localStorage. Až když se uloží klientem
      //začne pravidelní 60 sekundové ukládání do DBF
      console.log(
        headerClients.find((c) => c.id === activeId.id_client)?.notSavedDetected
      );
      if (!activeId?.id_client) return;
      if (!changeOccuredRef.current) return;
      if (
        headerClients.find((c) => c.id === activeId.id_client)
          ?.notSavedDetected === true
      )
        return;
      changeOccuredRef.current = false;

      console.log(`${activeId.id_client} - autosave to DB triggered`);

      const getSavedFromLocalStorage = localStorage.getItem(activeId.id_client);
      console.log("getSavedFromLocalStorage:", getSavedFromLocalStorage);

      if (!getSavedFromLocalStorage) return;
      console.log(
        "60sec autosave - nalezeno uložené vyšetření v localStorage:",
        getSavedFromLocalStorage
      );

      const newExamDataSet = {
        id_clients: activeId.id_client,
        id_branches: user.branch_id,
        id_members: activeId.id_member,
        name: optometryRecordName,
        data: getSavedFromLocalStorage,
      };
      try {
        await SaveOptometryItemsToDB(newExamDataSet);
      } catch (err) {
        setError(err.message);
      }
    }, 10000); // každých 60 sekund

    return () => clearInterval(interval);
  }, [activeId]);

  // Formát dne a datumu v češtině
  const formattedDate = date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  // Nastavení výchozího názvu vyšetření při načtení komponenty
  useEffect(() => {
    setOptometryRecordName(`${formattedDate} RX`);
  }, []);

  // Aktualizace zadaných hodnot v modulu v optometryItems
  const handleUpdateItem = (id, newValues) => {
    setOptometryItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, values: newValues } : item
      )
    );
  };

  const handleSavetoDBF = async () => {
    setIsLoading(true); // 👈 zapneme loader
    const exportObject = ConvertOptometryItems(optometryItems);

    console.log(`ID CLIENT ${activeId.id_client}`);
    console.log(`ID BRANCH ${user.branch_id}`);
    console.log(`ID MEMBER ${activeId.id_member}`);
    console.log(`Name ${optometryRecordName}`);
    console.log(exportObject);

    const newExamDataSet = {
      id_clients: activeId.id_client,
      id_branches: user.branch_id,
      id_members: activeId.id_member,
      name: optometryRecordName,
      data: exportObject,
    };
    console.log(newExamDataSet.data);

    // Update headerClients 'notSavedDetected' flag using setHeaderClients
    if (typeof setHeaderClients === "function") {
      setHeaderClients((prev) =>
        prev.map((c) =>
          c.id === activeId.id_client ? { ...c, notSavedDetected: false } : c
        )
      );
    }

    try {
      await SaveOptometryItemsToDB(newExamDataSet);
      console.log("Uloženo do DB");
    } catch (err) {
      setError(err.message);
    }

    console.log("Uložení do localStorage místo DB");
    localStorage.setItem(
      newExamDataSet.id_clients,
      JSON.stringify(newExamDataSet)
    );
    console.log("Data uložena do localStorage.");

    setIsLoading(false); // 👈 vypneme loader
  };

  //Kvůli AUTOSAVE funkci
  const saveRef = useRef();
  saveRef.current = handleSavetoDBF;

  useEffect(() => {
    return () => {
      console.log("Autosave při opuštění stránky...");
      saveRef.current();
    };
  }, []);

  // useEffect (()=> {
  //   optometryItems.map(()=> {
  //     const Component = optometryItems.component;
  //     setItemsComponent((prev) => ({...prev , Component}));
  //   })
  // }, [optometryItems]);

  useEffect(() => {
    if (activeElement == 0) {
      console.log(`Son says good night.`);
    }
  }, [activeElement]);

  return (
    <div className="optometry-container">
      <div className="optometry-left-container">
        {/* Horni MENU */}
        <div className="optometry-modul-container">
          <div className="optometry-modul-panel">
            <button className="menu-btn">DIOP</button>
            <button className="menu-btn">ASTG</button>
            <button className="menu-btn">FUNC</button>
            <button className="menu-btn">BINO</button>
            <button className="menu-btn">CLENS</button>
            <button className="menu-btn">MEDIC</button>
          </div>
          <div className="optometry-modul-panel">
            <button className="menu-btn">RX</button>
            <button className="menu-btn">KČ</button>
            <button className="menu-btn">BINO</button>
            <button className="menu-btn settings">...</button>
          </div>
          <div className="optometry-modul-panel">
            <button
              className="menu-btn-export"
              type="submit"
              onClick={handleSavetoDBF}
              style={{ marginRight: "5px" }}
            >
              Nový
            </button>
            <input
              type="text"
              value={optometryRecordName ?? ""}
              onChange={(e) => setOptometryRecordName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSavetoDBF();
                }
              }}
              placeholder={`Název vyšetření`}
            />
            <button
              className="menu-btn-save"
              type="submit"
              onClick={handleSavetoDBF}
            >
              Uložit
            </button>
            <button
              className="menu-btn-export"
              type="submit"
              onClick={handleSavetoDBF}
            >
              Smazat
            </button>
            <button
              className="menu-btn-export"
              type="submit"
              onClick={handleSavetoDBF}
            >
              Export
            </button>
          </div>
        </div>
        <div className="optometry-area">
          {/* OPTOMETRY ITEMS */}
          {optometryItems.map((item) => {
            const Component = item.component;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`optometry-modul ${item.width} ${
                  activeItem === item.id ? "active" : ""
                } ${
                  activeElement == 0 && activeItem === item.id ? "move" : ""
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                <Component
                  isActive={activeItem === item.id ? true : false}
                  setActiveElement={setActiveElement}
                  itemValues={item.values}
                  onChange={(newValues) => handleUpdateItem(item.id, newValues)}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="optometry-right-container">
        <div className="optometry-right-container-head">
          <h6>INFO</h6>
          <PuffLoaderSpinnerDark active={isLoading} />
        </div>
        <div className="optometry-right-container-body">
          {/* Anamnéza */}
          {optometryItems[activeItem - 1]?.component.name ==
            "OptometryAnamnesis" && (
            <>
              <p>
                V rámci anamnézy je nutné zjistit minulé zkušenosti, léky a
                požadavky klienta.
              </p>
              <p>
                Důležité je zdravotní anamnéza jak osobní, tak rodinná,
                pracovní, sociální a volnočasová.
              </p>
              <p>...</p>
            </>
          )}

          {/* Naturální VIZUS */}
          {optometryItems[activeItem - 1]?.component.name ==
            "OptometryNaturalVisus" && (
            <>
              <p>
                Zde zadej hodnotu naturálního vizu. Je to hodnota, kterou klient
                čte bez nasazené jakékoliv korekce do dálky.
              </p>
              <p>
                Hodnotu zaznamenej nejdříve pro PRAVÉ oko a poté pro LEVÉ oko.
                Do kolonky BINO pak zadej vizus přečtený oběma očima.
              </p>
              <p>...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientOptometry;
