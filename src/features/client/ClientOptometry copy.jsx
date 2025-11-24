import { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import PuffLoaderSpinnerDark from "../../components/loader/PuffLoaderSpinnerDark.jsx";
import "./ClientOptometry.css";

//IMPORT OPTOMETRY COMPONENTS
import OptometryAnamnesis from "../../components/optometry/OptometryAnamnesis";
import OptometryNaturalVisus from "../../components/optometry/OptometryNaturalVisus";
import OptometryRefractionARK from "../../components/optometry/OptometryRefractionARK";
import OptometryRefractionFull from "../../components/optometry/OptometryRefractionFull";
import RestoreOptometryItems from "../../components/optometry/RestoreOptometryItems.jsx";

const API_URL = import.meta.env.VITE_API_URL;

// === Debounce ukládání do localStorage ===
let localSaveTimeout;
function saveToLocalStorage(data, clientId) {
  clearTimeout(localSaveTimeout);
  localSaveTimeout = setTimeout(() => {
    localStorage.setItem(clientId, JSON.stringify(data));
    console.log("Uloženo do localStorage:", data);
  }, 1000); // uloží až po 1 s od poslední změny
}

function ClientOptometry() {
  const { user, activeId } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveIsActive, setSaveIsActive] = useState(false);

  const [optometryItems, setOptometryItems] = useState([
    {
      id: "1",
      modul: "1",
      width: "w50",
      component: OptometryAnamnesis,
      values: { name: "Anamnéza", text: "" },
    },
    {
      id: "2",
      modul: "2",
      width: "w25",
      component: OptometryNaturalVisus,
      values: { name: "Naturální vizus", pV: "1.25", lV: "1.25+", bV: "2.0++", style: 0, text: "" },
    },
    {
      id: "3",
      modul: "3",
      width: "w25",
      component: OptometryRefractionARK,
      values: { name: "OBJEKTIVNÍ refrakce", pS: "-1.23", pC: "-1.79", pA: "179", lS: "+6.85", lC: "-1.47", lA: "123", text: "" },
    },
    {
      id: "4",
      modul: "3",
      width: "w75",
      component: OptometryRefractionFull,
      values: { name: "Refrakce - plný zápis", pS: "-3,75", pC: "-4,50", pA: "180", pP: "2,5", pB: "90", pAdd: "-3,25", lS: "+4,50", lC: "90", lA: "122", lP: "2,5", lB: "270", lAdd: "+2,50", pV: "0,63+", lV: "0,8+", bV: "1,25+", style: 0, text: "" },
    },
  ]);

  const [activeItem, setActiveItem] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [optometryRecordName, setOptometryRecordName] = useState("");
  const [date, setDate] = useState(new Date());

  const formattedDate = date.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });

  useEffect(() => setOptometryRecordName(`Rx ${formattedDate}`), []);

  const handleUpdateItem = (id, newValues) => {
    setOptometryItems(prev => prev.map(item => item.id === id ? { ...item, values: newValues } : item));
  };

  // === Ukládání do DB / localStorage ===
  const handleSavetoDBF = async () => {
    if (!activeId?.id_client) return;
    setIsLoading(true);

    const exportObject = {};
    optometryItems.forEach(modul => {
      const key = `${modul.id}-${modul.modul}`;
      const processedValues = {};
      Object.entries(modul.values).forEach(([k, v]) => {
        if (v === "" || v === null || v === undefined) return;
        const normalized = typeof v === "string" ? v.replace(",", ".") : v;
        const num = Number(normalized);
        processedValues[k] = !isNaN(num) ? Math.round(num * 100) : v;
      });
      exportObject[key] = processedValues;
    });

    const newExamDataSet = {
      id_clients: activeId.id_client,
      id_branches: user.branch_id,
      id_members: activeId.id_member,
      name: optometryRecordName,
      data: exportObject,
    };

    if (saveIsActive) {
      try {
        const res = await fetch(`${API_URL}/client/save_examination`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExamDataSet),
        });
        const data = await res.json();
        console.log("Uloženo do DB:", data);
      } catch (err) {
        console.error("Chyba při ukládání do DB:", err);
        setError("Chyba při ukládání vyšetření.");
      } finally {
        setIsLoading(false);
      }
    } else {
      saveToLocalStorage(newExamDataSet, activeId.id_client);
      setIsLoading(false);
    }
  };

  // === Automatické ukládání do DB každou minutu ===
  useEffect(() => {
    const interval = setInterval(() => {
      handleSavetoDBF();
    }, 60000);

    return () => clearInterval(interval);
  }, [activeId, user.branch_id, optometryItems, optometryRecordName]);

  // === Načtení z localStorage při startu ===
  useEffect(() => {
    if (!activeId?.id_client) return;
    const saved = localStorage.getItem(activeId.id_client);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    setOptometryRecordName(parsed.name);

    const restoredItems = RestoreOptometryItems(parsed.data, optometryItems);
    setOptometryItems(restoredItems);

    console.log("Načtena data z localStorage:", restoredItems);
  }, [activeId]);

  return (
    <div className="optometry-container">
      <div className="optometry-left-container">
        <div className="optometry-modul-container">
          <div className="optometry-modul-panel">
            <button className="menu-btn">DIOP</button>
            <button className="menu-btn">ASTG</button>
            <button className="menu-btn">FUNC</button>
          </div>
          <div className="optometry-modul-panel">
            <input
              type="text"
              value={optometryRecordName ?? ""}
              onChange={e => setOptometryRecordName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSavetoDBF(); } }}
              placeholder="Název vyšetření"
            />
            <button className="menu-btn-save" type="submit" onClick={handleSavetoDBF}>Uložit</button>
          </div>
        </div>

        <div className="optometry-area">
          {optometryItems.map(item => {
            const Component = item.component;
            return (
              <div key={item.id} className={`optometry-modul ${item.width} ${activeItem === item.id ? "active" : ""}`}>
                <Component
                  isActive={activeItem === item.id}
                  setActiveElement={setActiveElement}
                  itemValues={item.values}
                  onChange={newValues => handleUpdateItem(item.id, newValues)}
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
      </div>
    </div>
  );
}

export default ClientOptometry;
