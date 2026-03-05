import { useState } from "react";
import OptometryRefractionFull from "../../components/optometry/OptometryRefractionFull";
import "./ClientLab.css";

const LAB_TABS = [
  "ADD interval",
  "BB-AKO",
  "BB-KONV",
  "COVER",
  "MOTIL",
  "HTF-FAR",
  "HTF-NEAR",
  "FV-FAR",
  "FV",
];

const createEmptyMatrix = () => Array.from({ length: 9 }, () => "");

const REFRACTION_FULL_PREVIEW_VALUES = {
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
};

function ClientLab() {
  const [showPrismBase, setShowPrismBase] = useState(true);
  const [showBinoTabs, setShowBinoTabs] = useState(true);
  const [activeLabTab, setActiveLabTab] = useState(null);
  const [tabMatrices, setTabMatrices] = useState(() =>
    Object.fromEntries(LAB_TABS.map((tab) => [tab, createEmptyMatrix()])),
  );

  const activeMatrix = activeLabTab ? tabMatrices[activeLabTab] : null;

  const handleMatrixChange = (index, value) => {
    if (!activeLabTab) return;

    setTabMatrices((prev) => {
      const current = prev[activeLabTab] ?? createEmptyMatrix();
      const updated = [...current];
      updated[index] = value;

      return {
        ...prev,
        [activeLabTab]: updated,
      };
    });
  };

  return (
    <div className="lab-client-lab-container">
      <div className="lab-client-lab-content">
        <div className="lab-optometry-container">
          <div className="lab-optometry-left-container">
            <div className="lab-optometry-area">
              <div
                className={`lab-optometry-modul lab-w75 lab-active ${
                  activeLabTab && showBinoTabs ? "lab-expanded" : ""
                } ${showPrismBase ? "" : "lab-hide-prism-base"}`}
              >
                <div className="lab-modul-toggle">
                  <div className="lab-modul-toggle-row">
                    <label className="lab-toggle-switch">
                      <input
                        type="checkbox"
                        checked={showPrismBase}
                        onChange={(e) => setShowPrismBase(e.target.checked)}
                      />
                      <span className="lab-toggle-slider" />
                    </label>
                    <span className="lab-modul-toggle-label">PRIZMA</span>
                  </div>

                  <div className="lab-modul-toggle-row">
                    <label className="lab-toggle-switch">
                      <input
                        type="checkbox"
                        checked={showBinoTabs}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setShowBinoTabs(checked);
                          if (!checked) setActiveLabTab(null);
                        }}
                      />
                      <span className="lab-toggle-slider" />
                    </label>
                    <span className="lab-modul-toggle-label">BINO</span>
                  </div>
                </div>
                <OptometryRefractionFull
                  isActive={true}
                  setActiveElement={() => {}}
                  itemValues={REFRACTION_FULL_PREVIEW_VALUES}
                  onChange={() => {}}
                  signColoringForSphCyl={true}
                />
                {showBinoTabs && (
                  <div
                    className="lab-bottom-tabs"
                    role="tablist"
                    aria-label="Lab tabs"
                  >
                    {LAB_TABS.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={`lab-bottom-tab ${
                          activeLabTab === tab ? "lab-tab-active" : ""
                        }`}
                        onClick={() => setActiveLabTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}

                {activeLabTab && showBinoTabs && (
                  <div className="lab-tab-matrix-section">
                    <div className="lab-tab-matrix-title">{activeLabTab}</div>
                    <div className="lab-tab-matrix-grid">
                      {activeMatrix?.map((value, index) => (
                        <input
                          key={`${activeLabTab}-${index}`}
                          className="lab-tab-matrix-input"
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleMatrixChange(index, e.target.value)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientLab;
