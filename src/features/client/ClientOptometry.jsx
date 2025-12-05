import { useEffect, useState } from "react";
import { useRef } from "react";
import { useUser } from "../../context/UserContext";

import ModulesDB from "../../components/optometry/ModulesDB.jsx";
import ConvertOptometryItems from "../../components/optometry/ConvertOptometryItems.jsx";
import restoreOptometryItems from "../../components/optometry/RestoreOptometryItems.jsx";
import SaveOptometryItemsToDB from "../../components/optometry/SaveOptometryItemsToDB.jsx";
import LoadExaminationFromDB from "../../components/optometry/LoadExaminationFromDB.jsx";
// import DeleteOptometryRecord from "../../components/optometry/DeleteOptometryRecord.jsx"; // implementuj podle backendu

import PuffLoaderSpinnerDark from "../../components/loader/PuffLoaderSpinnerDark.jsx";
import useAutosave from "./useAutosave";

// import jsPDF from "jspdf"; // pokud používáš export do PDF

import "./ClientOptometry.css";

function ClientOptometry({ client }) {
  const optometryModules = ModulesDB();
  const [optometryItems, setOptometryItems] = useState(optometryModules);

  const { user, headerClients, activeId, setHeaderClients } = useUser();

  const [activeItem, setActiveItem] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [optometryRecordName, setOptometryRecordName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dateRef = useRef(new Date());

  const formattedDate = dateRef.current.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  // výchozí název
  useEffect(() => {
    setOptometryRecordName(`${formattedDate} RX`);
  }, [formattedDate]);

  // HOOK: autosave
  const { saveNow } = useAutosave({
    data: optometryItems,
    name: optometryRecordName,
    clientId: activeId?.id_client,
    branchId: user.branch_id,
    memberId: activeId?.id_member,
    convertFn: ConvertOptometryItems,
    saveToDBFn: SaveOptometryItemsToDB,
    headerClients,
    setHeaderClients,
    autosaveIntervalMs: 60000,
    debounceMs: 1000,
  });

  // --- HELPERS ---
  const resetToDefaults = () => {
    const defaults = ModulesDB();
    setOptometryItems(defaults);
    setOptometryRecordName(`${formattedDate} RX`);
  };

  // Nový
  const handleNew = () => {
    resetToDefaults();

    // uložit jen do localStorage
    try {
      localStorage.setItem(activeId?.id_client, JSON.stringify(ModulesDB()));
    } catch (e) {
      console.warn("localStorage save failed", e);
    }

    // označit jako neuloženo
    if (typeof setHeaderClients === "function" && activeId?.id_client) {
      setHeaderClients((prev) =>
        prev.map((c) =>
          c.id === activeId.id_client ? { ...c, notSavedDetected: true } : c
        )
      );
    }
  };

  // Uložit (ručně)
  const handleSave = async () => {
    if (!activeId?.id_client) return;

    setIsLoading(true);
    try {
      await saveNow();
    } catch (err) {
      setError(err.message || "Chyba při ukládání");
    } finally {
      setIsLoading(false);
    }
  };

  // Smazat
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // pokud má klient uložený název (není "(neuloženo)") -> smažeme z DB
      if (client?.examName && client.examName !== "(neuloženo)") {
        // potřebuješ implementovat DeleteOptometryRecord na backendu
        if (typeof window.DeleteOptometryRecord === "function") {
          await window.DeleteOptometryRecord(
            client.id,
            user.branch_id,
            client.examName
          );
        } else {
          // fallback: zavolat endpoint přes fetch (příklad)
          await fetch(`${process.env.VITE_API_URL}/optometry/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_clients: client.id,
              id_branches: user.branch_id,
              name: client.examName,
            }),
          });
        }
      }

      // smazat localStorage
      try {
        localStorage.removeItem(client.id);
      } catch (e) {
        console.warn("localStorage remove failed", e);
      }

      // reset UI
      resetToDefaults();

      // resetovat active tertiary button a notSavedDetected
      if (typeof setHeaderClients === "function") {
        setHeaderClients((prev) =>
          prev.map((c) =>
            c.id === client.id
              ? { ...c, activeTertiaryButton: 0, notSavedDetected: true }
              : c
          )
        );
      }
    } catch (err) {
      setError(err.message || "Chyba při mazání");
    } finally {
      setIsLoading(false);
    }
  };

  // Export (PDF + tisk)
  const handleExport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text(`Záznam vyšetření — ${optometryRecordName}`, 10, 10);

      // jednoduchý export JSON -> PDF (doporučuji vytvořit pěknou šablonu podle potřeby)
      const text = JSON.stringify(optometryItems, null, 2);
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 10, 20);

      doc.save(`optometrie-${activeId?.id_client || "unknown"}.pdf`);
    } catch (e) {
      console.error("PDF export failed", e);
      // fallback: tisk stránky
      window.print();
    }
  };

  // Načtení vyšetření při změně tertiárního menu
  useEffect(() => {
    const load = async () => {
      if (!client || !client.examName || client.examName === "(neuloženo)")
        return;

      setIsLoading(true);

      // uložíme aktuální data před přepnutím
      try {
        await saveNow();
      } catch (e) {
        // ignoruj chyby saveNow při načítání
        console.warn("save before load failed", e);
      }

      try {
        const examination = await LoadExaminationFromDB(
          client.id,
          user.branch_id,
          client.examName
        );

        const restoredItems = restoreOptometryItems(
          examination.data,
          optometryModules
        );

        setOptometryItems(restoredItems);
        setOptometryRecordName(client.examName);
      } catch (err) {
        console.error("load exam failed", err);
        setError(err.message || "Chyba při načítání vyšetření");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [client.activeTertiaryButton]);

  const handleUpdateItem = (id, newValues) => {
    setOptometryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, values: newValues } : item
      )
    );

    // označíme, že změna proběhla (autosave hook detekuje přes debounce)
    if (typeof setHeaderClients === "function" && activeId?.id_client) {
      setHeaderClients((prev) =>
        prev.map((c) =>
          c.id === activeId.id_client ? { ...c, notSavedDetected: true } : c
        )
      );
    }
  };

  return (
    <div className="optometry-container">
      <div className="optometry-left-container">
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
            <button className="menu-btn-export" onClick={handleNew}>
              Nový
            </button>

            <input
              type="text"
              value={optometryRecordName ?? ""}
              onChange={(e) => setOptometryRecordName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
              placeholder={`Název vyšetření`}
            />

            <button className="menu-btn-save" onClick={handleSave}>
              Uložit
            </button>

            <button className="menu-btn-export" onClick={handleDelete}>
              Smazat
            </button>

            <button className="menu-btn-export" onClick={handleExport}>
              Export
            </button>
          </div>
        </div>

        <div className="optometry-area">
          {optometryItems.map((item) => {
            const Component = item.component;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`optometry-modul ${item.width} ${
                  activeItem === item.id ? "active" : ""
                } ${
                  activeElement === 0 && activeItem === item.id ? "move" : ""
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                <Component
                  isActive={activeItem === item.id}
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
          {optometryItems[activeItem - 1]?.component.name ===
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
            </>
          )}

          {optometryItems[activeItem - 1]?.component.name ===
            "OptometryNaturalVisus" && (
            <>
              <p>Zde zadej hodnotu naturálního vizu – bez korekce do dálky.</p>
              <p>Nejprve PRAVÉ oko, poté LEVÉ a nakonec BINO (obě oči).</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientOptometry;
