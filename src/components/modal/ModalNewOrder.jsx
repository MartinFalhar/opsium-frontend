import React, { useState, useEffect } from "react";
import ConfirmDelete from "./ConfirmDelete";
import "./Modal.css";

export default function ModalNewOrder({
  fields,
  initialValues = {},
  onSubmit,
  onClose,
  onCancel,
  firstButton,
  secondButton,
  thirdButton,
  onClickThirdButton,
  suppliers = [],
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [values, setValues] = useState({});

  // Aktualizace values při změně initialValues nebo fields
  useEffect(() => {
    const init = {};
    fields.forEach((f) => {
      const val = initialValues?.[f.varName];
      init[f.varName] = val !== undefined && val !== null ? val : "";
    });
    setValues(init);
  }, [fields, initialValues]);

  //Univerzální handler pro změnu hodnoty pole
  //libovolného elementu formuláře
  const handleChange = (varName, value) => {
    setValues((prev) => ({ ...prev, [varName]: value }));
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel(); // Zavolej callback pro zrušení
    }
    onClose(); // Zavři modal
  };

  // Handler pro třetí tlačítko
  // Má hlídat stavy, kvůli zobrazení
  // konfirmačního formuláře (Smazat atd.)
  const handleThirdButtonClick = () => {
    if (thirdButton === "Smazat") {
      setShowConfirm(true);
    } else {
      // Pro jiné akce než smazání
      // vyvolá příslušný callback
      // který změní fields a values
      if (thirdButton === "Naskladnit" && onClickThirdButton) {
        onClickThirdButton();
      }
    }
  };

  const handleConfirmDelete = () => {
    if (onClickThirdButton) {
      onClickThirdButton();
    }
    setShowConfirm(false);
    onClose();
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <ConfirmDelete
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelConfirm}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Zadej údaje</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
            setTimeout(onClose, 2);
          }}
        >
          <div
            //Jestliže je více než 5 polí, použij dva
            //sloupce pro zobrazení
            className={`modal-content ${fields.length > 5 ? "two-columns" : ""}`}
          >
            {fields.map((field, index) => {
              // Pro pole s dynamickými options použij předem načtená data
              const isDynamic =
                field.options &&
                typeof field.options === "object" &&
                !Array.isArray(field.options);
              const optionsList = isDynamic
                ? suppliers
                : Array.isArray(field.options)
                  ? field.options
                  : [];

              return (
                <div
                  key={index}
                  className="modal-field"
                  style={field.input === "hidden" ? { display: "none" } : {}}
                >
                  <label>
                    {field.label}
                    {field.required && <span style={{ color: "red" }}> *</span>}
                  </label>
                  {(field.options && Array.isArray(field.options)) ||
                  (field.options &&
                    typeof field.options === "object" &&
                    !Array.isArray(field.options)) ? (
                    <select
                      value={values[field.varName] ?? ""}
                      onChange={(e) => {
                        if (!field.readOnly) {
                          handleChange(field.varName, e.target.value);
                        }
                      }}
                      required={field.required}
                      disabled={field.disabled}
                      style={
                        field.disabled || field.readOnly
                          ? {
                              backgroundColor: "#f0f0f0",
                              cursor: "not-allowed",
                              pointerEvents: field.readOnly ? "none" : "auto",
                            }
                          : {}
                      }
                    >
                      <option value="">-- Vyberte --</option>
                      {optionsList.map((option, i) => {
                        // Pokud je option objekt, použij id jako value a nick jako text
                        const isObject =
                          typeof option === "object" && option !== null;
                        return (
                          <option key={i} value={isObject ? option.id : option}>
                            {isObject ? option.nick : option}
                          </option>
                        );
                      })}
                    </select>
                  ) : field.input === "textarea" ? (
                    <textarea
                      value={values[field.varName] ?? ""}
                      onChange={(e) =>
                        handleChange(field.varName, e.target.value)
                      }
                      required={field.required}
                      readOnly={field.readOnly}
                      disabled={field.disabled}
                      rows={field.rows || 3}
                      style={
                        field.readOnly || field.disabled
                          ? {
                              backgroundColor: "#f0f0f0",
                              cursor: "not-allowed",
                            }
                          : {}
                      }
                    />
                  ) : field.input === "message" ? (
                    <h2>{values[field.varName] ?? ""}</h2>
                  ) : (
                    <input
                      type={field.input || "text"}
                      value={values[field.varName] ?? ""}
                      onChange={(e) =>
                        handleChange(field.varName, e.target.value)
                      }
                      required={field.required}
                      autoFocus={index === 0}
                      readOnly={field.readOnly}
                      disabled={field.disabled}
                      style={
                        field.readOnly || field.disabled
                          ? {
                              backgroundColor: "#f0f0f0",
                              cursor: "not-allowed",
                            }
                          : {}
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="modal-actions">
            {thirdButton !== null && initialValues.name !== "" && (
              <button
                className={
                  thirdButton === "Smazat" ? "button-warning" : "button"
                }
                type="button"
                onClick={handleThirdButtonClick}
              >
                {thirdButton}
              </button>
            )}
            <button type="button" onClick={handleClose}>
              {secondButton}
            </button>
            <button type="submit">{firstButton}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
