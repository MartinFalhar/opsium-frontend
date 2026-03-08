import { useState, useEffect } from "react";
// import "./OptometryRefractionFull.css";

const DEFAULT_BINO_TABS = [
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

function OptometryRefractionFull({
  isActive,
  itemValues,
  onChange,
  signColoringForSphCyl = false,
  enableExtendedLabUi = true,
  binoTabs = DEFAULT_BINO_TABS,
  defaultShowPrismBase = false,
  defaultShowBinoTabs = false,
  defaultShowAdd = true,
  onDeleteAction,
  onCopyAction,
  onCopyAddAction,
  deleteIconSrc,
  copyIconSrc,
}) {
  const [values, setValues] = useState(itemValues);
  const [showAdd, setShowAdd] = useState(
    typeof itemValues?.showAdd === "boolean"
      ? itemValues.showAdd
      : defaultShowAdd,
  );
  const [showPrismBase, setShowPrismBase] = useState(defaultShowPrismBase);
  const [showBinoTabs, setShowBinoTabs] = useState(defaultShowBinoTabs);
  const [activeBinoTab, setActiveBinoTab] = useState(null);
  const [tabMatrices, setTabMatrices] = useState(() =>
    Object.fromEntries(binoTabs.map((tab) => [tab, createEmptyMatrix()])),
  );

  //PROPS poslané z rodiče, změny posílá zpět rodiči
  useEffect(() => {
    setValues(itemValues);
  }, [itemValues]);

  useEffect(() => {
    setTabMatrices((prev) => {
      const next = { ...prev };

      binoTabs.forEach((tab) => {
        if (!next[tab]) next[tab] = createEmptyMatrix();
      });

      Object.keys(next).forEach((tab) => {
        if (!binoTabs.includes(tab)) delete next[tab];
      });

      return next;
    });

    if (activeBinoTab && !binoTabs.includes(activeBinoTab)) {
      setActiveBinoTab(null);
    }
  }, [binoTabs, activeBinoTab]);

  //zachtycení změn v jednotlivých polích - globální handler
  const handleChange = (key, value) => {
    const newData =
      key === "pAdd"
        ? { ...values, pAdd: value, lAdd: value }
        : { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData); // pošle změnu zpět do rodiče
  };

  const getSignedClassName = (key, value) => {
    if (!signColoringForSphCyl) return "";

    const isSphOrCyl = ["pS", "pC", "lS", "lC"].includes(key);
    if (!isSphOrCyl) return "";

    const normalized = String(value ?? "")
      .trim()
      .replace(",", ".")
      .replace(/\s+/g, "");

    const numericValue = Number(normalized);
    if (Number.isNaN(numericValue) || numericValue === 0) return "";

    return numericValue < 0 ? "signed-negative" : "signed-positive";
  };

  const handleTabMatrixChange = (index, value) => {
    if (!activeBinoTab) return;

    setTabMatrices((prev) => {
      const current = prev[activeBinoTab] ?? createEmptyMatrix();
      const updated = [...current];
      updated[index] = value;
      return {
        ...prev,
        [activeBinoTab]: updated,
      };
    });
  };

  const handlePAddKeyDown = (e) => {
    if (e.key !== "Enter" || !onCopyAddAction) return;

    e.preventDefault();
    e.stopPropagation();
    onCopyAddAction(e, e.currentTarget.value, values);
  };

  const activeMatrix = activeBinoTab ? tabMatrices[activeBinoTab] : null;
  const isExpanded = enableExtendedLabUi && !!activeBinoTab && showBinoTabs;
  const shouldHideAdd = enableExtendedLabUi && !showAdd;
  const shouldHidePrismBase = enableExtendedLabUi && !showPrismBase;
  return (
    <div
      className={`opt-refraction-full-shell ${isExpanded ? "opt-expanded" : ""}`}
    >
      {enableExtendedLabUi && (
        <div className="opt-modul-toggle">
          <div className="opt-modul-toggle-row">
            <label className="opt-toggle-switch">
              <input
                type="checkbox"
                checked={showAdd}
                onChange={(e) => setShowAdd(e.target.checked)}
              />
              <span className="opt-toggle-slider" />
            </label>
            <span className="opt-modul-toggle-label">ADD</span>
          </div>

          <div className="opt-modul-toggle-row">
            <label className="opt-toggle-switch">
              <input
                type="checkbox"
                checked={showPrismBase}
                onChange={(e) => setShowPrismBase(e.target.checked)}
              />
              <span className="opt-toggle-slider" />
            </label>
            <span className="opt-modul-toggle-label">PRIZMA</span>
          </div>

          <div className="opt-modul-toggle-row">
            <label className="opt-toggle-switch">
              <input
                type="checkbox"
                checked={showBinoTabs}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setShowBinoTabs(checked);
                  if (!checked) {
                    setActiveBinoTab(null);
                    return;
                  }

                  const preferredTab = binoTabs.includes("BB-AKO")
                    ? "BB-AKO"
                    : (binoTabs[0] ?? null);
                  setActiveBinoTab(preferredTab);
                }}
              />
              <span className="opt-toggle-slider" />
            </label>
            <span className="opt-modul-toggle-label">BINO</span>
          </div>

          {onDeleteAction && onCopyAction && deleteIconSrc && copyIconSrc && (
            <div className="opt-modul-toggle-actions">
              <button
                type="button"
                className="modul-action-btn"
                onClick={onCopyAction}
                aria-label="Copy module"
              >
                <span className="modul-action-icon-copy" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="modul-action-btn wider-btn"
                onClick={(e) => {
                  if (onCopyAddAction) {
                    onCopyAddAction(e, values?.pAdd, values);
                    return;
                  }

                  onCopyAction?.(e);
                }}
                aria-label="Copy and add module"
              >
                <span className="modul-action-icon-copy" aria-hidden="true" />
                {`ADD`}
              </button>
              <img
                src={deleteIconSrc}
                alt="Delete"
                className="modul-action-icon-delete"
                onClick={onDeleteAction}
                role="button"
                tabIndex={0}
              />
            </div>
          )}
        </div>
      )}

      <div className={`modul ${isActive ? "active" : ""}`}>
        <input
          value={values.name}
          className={`modul-name ${isActive ? "active" : ""}`}
          type="numeric"
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <div
          className={`grid-refraction-full ${isActive ? "active" : ""} ${shouldHidePrismBase ? "opt-hide-prism-base" : ""} ${shouldHideAdd ? "opt-hide-add" : ""}`}
        >
          <p className="desc-table"></p>
          <p className="desc-table">SPH</p>
          <p className="desc-table">CYL</p>
          <p className="desc-table">AX</p>
          <p className="desc-table">Prizma</p>
          <p className="desc-table">Báze</p>
          <p className="desc-table">ADD</p>
          <p className="desc-table">Vizus</p>
          <p className="desc-table">BINO</p>

          <p className="desc">P</p>
          <input
            value={values.pS}
            type="text"
            className={getSignedClassName("pS", values.pS)}
            onChange={(e) => handleChange("pS", e.target.value)}
          />
          <input
            value={values.pC}
            type="text"
            className={getSignedClassName("pC", values.pC)}
            onChange={(e) => handleChange("pC", e.target.value)}
          />
          <input
            value={values.pA}
            type="text"
            onChange={(e) => handleChange("pA", e.target.value)}
          />
          <input
            value={values.pP}
            type="text"
            onChange={(e) => handleChange("pP", e.target.value)}
          />
          <input
            value={values.pB}
            type="text"
            onChange={(e) => handleChange("pB", e.target.value)}
          />
          <input
            value={values.pAdd}
            type="text"
            onChange={(e) => handleChange("pAdd", e.target.value)}
            onKeyDown={handlePAddKeyDown}
          />
          <input
            value={values.pV}
            type="text"
            onChange={(e) => handleChange("pV", e.target.value)}
          />
          <input
            value={values.bV}
            className="span-last"
            type="text"
            onChange={(e) => handleChange("bV", e.target.value)}
          />

          <p className="desc">L</p>
          <input
            value={values.lS}
            type="text"
            className={getSignedClassName("lS", values.lS)}
            onChange={(e) => handleChange("lS", e.target.value)}
          />
          <input
            value={values.lC}
            type="text"
            className={getSignedClassName("lC", values.lC)}
            onChange={(e) => handleChange("lC", e.target.value)}
          />
          <input
            value={values.lA}
            type="text"
            onChange={(e) => handleChange("lA", e.target.value)}
          />
          <input
            value={values.lP}
            type="text"
            onChange={(e) => handleChange("lP", e.target.value)}
          />
          <input
            value={values.lB}
            type="text"
            onChange={(e) => handleChange("lB", e.target.value)}
          />
          <input
            value={values.lAdd}
            type="text"
            onChange={(e) => handleChange("lAdd", e.target.value)}
          />
          <input
            value={values.lV}
            type="text"
            onChange={(e) => handleChange("lV", e.target.value)}
          />
        </div>
      </div>

      {enableExtendedLabUi && showBinoTabs && (
        <div className="opt-bottom-tabs" role="tablist" aria-label="Bino tabs">
          {binoTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`opt-bottom-tab ${activeBinoTab === tab ? "opt-tab-active" : ""}`}
              onClick={() => setActiveBinoTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {enableExtendedLabUi && activeBinoTab && showBinoTabs && (
        <div className="opt-tab-matrix-section">
          <div className="opt-tab-matrix-title">{activeBinoTab}</div>
          <div className="opt-tab-matrix-grid">
            {activeMatrix?.map((value, index) => (
              <input
                key={`${activeBinoTab}-${index}`}
                className="opt-tab-matrix-input"
                type="text"
                value={value}
                onChange={(e) => handleTabMatrixChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OptometryRefractionFull;
