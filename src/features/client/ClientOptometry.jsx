import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";

import ModulesDB from "../../components/optometry/ModulesDB.jsx";
import ConvertOptometryItems from "../../components/optometry/ConvertOptometryItems.jsx";
import restoreOptometryItems from "../../components/optometry/RestoreOptometryItems.jsx";
import SaveOptometryItemsToDB from "../../components/optometry/SaveOptometryItemsToDB.jsx";
import LoadExaminationFromDB from "../../components/optometry/LoadExaminationFromDB.jsx";
// import DeleteOptometryRecord from "../../components/optometry/DeleteOptometryRecord.jsx"; // implementuj podle backendu

import PuffLoaderSpinnerDark from "../../components/loader/PuffLoaderSpinnerDark.jsx";
import useAutosave from "./useAutosave";
import OptometryInfo from "../../components/optometry/OptometryInfo.jsx";
import Modal from "../../components/modal/Modal.jsx";
import SegmentedControlMulti from "../../components/controls/SegmentedControlMulti.jsx";
import Tabs from "../../components/controls/Tabs.jsx";
import AiAnamnesisAnalysisPanel from "../../components/ai/AiAnamnesisAnalysisPanel.jsx";

import closeIcon from "../../styles/svg/close.svg";
import copyIcon from "../../styles/svg/copy.svg";

// import jsPDF from "jspdf"; // pokud používáš export do PDF

import "./ClientOptometry.css";
const API_URL = import.meta.env.VITE_API_URL;
const COPY_ADD_OPTIONS = [
  "+0,25",
  "+0,50",
  "+0,75",
  "+1,00",
  "+1,25",
  "+1,50",
  "+1,75",
  "+2,00",
  "+2,25",
  "+2,50",
  "+2,75",
  "+3,00",
  "...",
];

const RIGHT_PANEL_TABS = [
  { label: "Analýza", value: "analysis" },
  { label: "AI", value: "ai" },
  { label: "Popis", value: "description" },
];

function ClientOptometry({ client }) {
  const [optometryItems, setOptometryItems] = useState(() => ModulesDB());

  const { user, headerClients, activeId, setHeaderClients, setMemory } =
    useUser();

  const [activeItem, setActiveItem] = useState(null);
  const [activeModul, setActiveModul] = useState(false);
  const [optometryRecordName, setOptometryRecordName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [showCopyAddModal, setShowCopyAddModal] = useState(false);
  const [copyAddSourceId, setCopyAddSourceId] = useState(null);
  const [copyAddSelection, setCopyAddSelection] = useState(["+0,25"]);
  const [copyAddCustomValue, setCopyAddCustomValue] = useState("");
  const [activeRightTab, setActiveRightTab] = useState(
    RIGHT_PANEL_TABS[0].value,
  );
  const [, setError] = useState("");

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
    clientId: activeId?.client_id,
    branchId: user.branch_id,
    memberId: activeId?.member_id,
    convertFn: ConvertOptometryItems,
    saveToDBFn: SaveOptometryItemsToDB,
    headerClients,
    setHeaderClients,
    autosaveIntervalMs: 60000,
    debounceMs: 1000,
  });

  const saveNowRef = useRef(saveNow);
  useEffect(() => {
    saveNowRef.current = saveNow;
  }, [saveNow]);

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
      localStorage.setItem(activeId?.client_id, JSON.stringify(ModulesDB()));
    } catch (e) {
      console.warn("localStorage save failed", e);
    }

    // označit jako neuloženo
    if (typeof setHeaderClients === "function" && activeId?.client_id) {
      setHeaderClients((prev) =>
        prev.map((c) =>
          c.id === activeId.client_id ? { ...c, notSavedDetected: true } : c,
        ),
      );
    }
  };

  // Uložit (ručně)
  const handleSave = async () => {
    if (!activeId?.client_id) return;

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
            client.examName,
          );
        } else {
          // fallback: zavolat endpoint přes fetch (příklad)
          await fetch(`${API_URL}/client/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_id: client.id,
              branch_id: user.branch_id,
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
              : c,
          ),
        );
      }
    } catch (err) {
      setError(err.message || "Chyba při mazání");
    } finally {
      setIsLoading(false);
    }
  };

  // Export přes backend /pdf/exam
  const handleExport = async () => {
    if (!activeId?.client_id) return;

    const examName = String(optometryRecordName ?? "").trim();
    if (!examName) return;

    setIsLoading(true);

    try {
      await saveNow();

      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/pdf/exam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          client_id: activeId.client_id,
          exam_name: examName,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Nepodařilo se vygenerovat PDF vyšetření.";
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // keep default message
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const opened = window.open(url, "_blank", "noopener,noreferrer");

      if (!opened) {
        // Fallback pokud prohlížeč zablokuje nové okno
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      // Necháme URL aktivní chvíli kvůli načtení PDF v nové záložce
      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (e) {
      console.error("PDF export failed", e);
      setError(e.message || "Chyba při exportu PDF");
    } finally {
      setIsLoading(false);
    }
  };

  // Načtení vyšetření při změně tertiárního menu
  useEffect(() => {
    const clientId = client?.id;
    const examName = client?.examName;
    const branchId = user?.branch_id;

    const load = async () => {
      if (!clientId || !examName || examName === "(neuloženo)") return;

      setIsLoading(true);

      // uložíme aktuální data před přepnutím
      try {
        await saveNowRef.current?.();
      } catch (e) {
        // ignoruj chyby saveNow při načítání
        console.warn("save before load failed", e);
      }

      try {
        const examination = await LoadExaminationFromDB(
          clientId,
          branchId,
          examName,
        );

        const restoredItems = restoreOptometryItems(
          examination.data,
          ModulesDB(),
        );

        setOptometryItems(restoredItems);
        setOptometryRecordName(examName);
      } catch (err) {
        console.error("load exam failed", err);
        setError(err.message || "Chyba při načítání vyšetření");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [
    client?.activeTertiaryButton,
    client?.id,
    client?.examName,
    user?.branch_id,
  ]);

  const markAsNotSaved = () => {
    if (typeof setHeaderClients === "function" && activeId?.client_id) {
      setHeaderClients((prev) =>
        prev.map((c) =>
          c.id === activeId.client_id ? { ...c, notSavedDetected: true } : c,
        ),
      );
    }
  };

  const duplicateItemById = (id, mapValuesFn, sourceValuesOverride) => {
    let nextId = null;

    setOptometryItems((prev) => {
      const sourceIndex = prev.findIndex((item) => item.id === id);
      if (sourceIndex === -1) return prev;

      const sourceItem = prev[sourceIndex];
      const maxId = prev.reduce((max, item) => Math.max(max, item.id), 0);
      nextId = maxId + 1;

      const originalValues = sourceValuesOverride ?? sourceItem.values ?? {};
      const clonedValues = JSON.parse(JSON.stringify(originalValues));
      const duplicatedValues = mapValuesFn
        ? mapValuesFn(clonedValues)
        : clonedValues;

      const duplicatedItem = {
        ...sourceItem,
        id: nextId,
        values: duplicatedValues,
      };

      const updated = [
        ...prev.slice(0, sourceIndex + 1),
        duplicatedItem,
        ...prev.slice(sourceIndex + 1),
      ];

      saveNow(updated);
      return updated;
    });

    if (nextId !== null) {
      setActiveItem(nextId);
      setMemory?.((prev) => ({ ...prev, dpt: nextId }));
      markAsNotSaved();
    }
  };

  const parseSignedNumber = (value) => {
    const normalized = String(value ?? "")
      .trim()
      .replace(",", ".")
      .replace(/\s+/g, "");

    const numeric = Number(normalized);
    return Number.isNaN(numeric) ? null : numeric;
  };

  const formatSignedNumber = (value) => {
    const fixed = value.toFixed(2).replace(".", ",");
    return value > 0 ? `+${fixed}` : fixed;
  };

  const addDeltaToSph = (originalValue, delta) => {
    const parsed = parseSignedNumber(originalValue);
    if (parsed === null) return originalValue;
    return formatSignedNumber(parsed + delta);
  };

  const buildNearAddValues = (values, delta, deltaLabel) => ({
    ...values,
    name: `BLÍZKO S ADD ${deltaLabel}`,
    pS: addDeltaToSph(values.pS, delta),
    lS: addDeltaToSph(values.lS, delta),
    pAdd: "",
    lAdd: "",
    pV: "",
    lV: "",
    bV: "",
    showAdd: false,
  });

  const handleUpdateItem = (id, newValues) => {
    setOptometryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, values: newValues } : item,
      ),
    );

    // označíme, že změna proběhla (autosave hook detekuje přes debounce)
    markAsNotSaved();
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation(); // zabrání kliknutí aktivovat celý modul
    setOptometryItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveNow(updated);
      return updated;
    });
  };

  const handleCopyItem = (e, id) => {
    e.stopPropagation(); // zabrání kliknutí aktivovat celý modul
    duplicateItemById(id);
  };

  const handleOpenCopyAddModal = (e, id, addValueFromModule) => {
    e.stopPropagation();

    const parsedAddValue = parseSignedNumber(addValueFromModule);
    const formatted =
      parsedAddValue !== null ? formatSignedNumber(parsedAddValue) : null;
    const preselected =
      formatted && COPY_ADD_OPTIONS.includes(formatted) ? formatted : "+0,25";

    setCopyAddSourceId(id);
    setCopyAddSelection([preselected]);
    setCopyAddCustomValue("");
    setShowCopyAddModal(true);
  };

  const handleCopyAddSubmit = () => {
    if (!copyAddSourceId) {
      setShowCopyAddModal(false);
      return;
    }

    const selected = copyAddSelection[0];
    if (!selected) return;

    let delta = null;

    if (selected === "...") {
      delta = parseSignedNumber(copyAddCustomValue);
      if (delta === null) return;
    } else {
      delta = parseSignedNumber(selected);
      if (delta === null) return;
    }

    const deltaLabel =
      selected === "..." ? formatSignedNumber(delta) : selected;

    duplicateItemById(copyAddSourceId, (values) =>
      buildNearAddValues(values, delta, deltaLabel),
    );

    setShowCopyAddModal(false);
  };

  return (
    <div className="container">
      <div className="optometry-left-container">
        <div className="input-panel">
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
            const isRefractionFullModule =
              Component?.name === "OptometryRefractionFull";
            return (
              <div
                key={item.id}
                id={item.id}
                className={`optometry-modul ${item.width} ${
                  activeItem === item.id ? "active" : ""
                } ${
                  activeModul === true && activeItem === item.id ? "move" : ""
                }`}
                onClick={() => setActiveItem(item.id)}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <Component
                  isActive={activeItem === item.id}
                  activeModul={activeModul}
                  setActiveModul={setActiveModul}
                  itemValues={item.values}
                  onChange={(newValues) => handleUpdateItem(item.id, newValues)}
                  onDeleteAction={(e) => handleDeleteItem(e, item.id)}
                  onCopyAction={(e) => handleCopyItem(e, item.id)}
                  onCopyAddAction={(e, addValue, sourceValues) =>
                    handleOpenCopyAddModal(e, item.id, addValue, sourceValues)
                  }
                  deleteIconSrc={closeIcon}
                  copyIconSrc={copyIcon}
                />
                {/* Zobrazeni ikon */}
                {hoveredItemId === item.id && !isRefractionFullModule && (
                  <div
                    className={`modul-actions ${
                      isRefractionFullModule ? "modul-actions-refraction" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="modul-action-btn"
                      onClick={(e) => handleCopyItem(e, item.id)}
                      aria-label="Copy module"
                    >
                      <span
                        className="modul-action-icon-copy"
                        aria-hidden="true"
                      />
                    </button>
                    <img
                      src={closeIcon}
                      alt="Delete"
                      className="modul-action-icon-delete"
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      role="button"
                      tabIndex={0}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showCopyAddModal && (
        <Modal
          fields={[]}
          initialValues={{}}
          title="Přidání refrakčního modulu s přidanou adicí"
          firstButton="Potvrdit"
          secondButton="Zrušit"
          onSubmit={handleCopyAddSubmit}
          onClose={() => setShowCopyAddModal(false)}
          onCancel={() => setShowCopyAddModal(false)}
          customContent={
            <div className="copy-add-modal-content">
              <p>
                Zvol hodnotu adice, která se přičte ke SPH pro pravé i levé oko
              </p>
              <SegmentedControlMulti
                items={COPY_ADD_OPTIONS}
                width="100%"
                selectedValues={copyAddSelection}
                onChange={(values) => {
                  if (!values.length) {
                    setCopyAddSelection([]);
                    return;
                  }

                  setCopyAddSelection([values[values.length - 1]]);
                }}
              />

              {copyAddSelection[0] === "..." && (
                <>
                  <h1>Zadej individuální hodnotu adice</h1>
                  <input
                    type="text"
                    value={copyAddCustomValue}
                    onChange={(e) => setCopyAddCustomValue(e.target.value)}
                    placeholder="Např. +0,33"
                  />
                </>
              )}
            </div>
          }
        />
      )}

      <div className="optometry-right-container">
        <div className="optometry-right-container-head">
          <h6>INFO</h6>
          <PuffLoaderSpinnerDark active={isLoading} />
        </div>
        <Tabs
          items={RIGHT_PANEL_TABS}
          selectedValue={activeRightTab}
          onChange={setActiveRightTab}
          idPrefix="optometry-right"
          width="100%"
        />

        {activeRightTab === "analysis" && (
          <div
            id="optometry-right-analysis-panel"
            role="tabpanel"
            aria-labelledby="optometry-right-analysis-tab"
            className="optometry-right-container-body"
          >
            <p>
              <OptometryInfo
                optometryItems={optometryItems}
                activeItem={activeItem}
              />
            </p>
          </div>
        )}

        {activeRightTab === "ai" && (
          <div
            id="optometry-right-ai-panel"
            role="tabpanel"
            aria-labelledby="optometry-right-ai-tab"
            className="optometry-right-container-body"
          >
            <AiAnamnesisAnalysisPanel optometryItems={optometryItems} />
          </div>
        )}

        {activeRightTab === "description" && (
          <div
            className="optometry-right-container-body"
            id="optometry-right-description-panel"
            role="tabpanel"
            aria-labelledby="optometry-right-description-tab"
          >
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
                <p>
                  Zde zadej hodnotu naturálního vizu – bez korekce do dálky.
                </p>
                <p>Nejprve PRAVÉ oko, poté LEVÉ a nakonec BINO (obě oči).</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientOptometry;
