import React, { useState, useMemo, useEffect } from "react";
import ConfirmDelete from "./ConfirmDelete";
import useNameList from "../store/GetNameList";

export default function Modal({
  fields,
  initialValues = {},
  onSubmit,
  onClose,
  onCancel,
  firstButton,
  secondButton,
  thirdButton,
  onClickThirdButton,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Najdi první pole s dynamickými options (zatím podporujeme pouze jedno)
  const dynamicField = useMemo(() => {
    return fields.find(
      (f) =>
        f.options && typeof f.options === "object" && !Array.isArray(f.options),
    );
  }, [fields]);

  // Načti data pro dynamické pole
  const dynamicData = useNameList(dynamicField?.options?.field);

  const [values, setValues] = useState(() => {
    const init = {};
    fields.forEach((f) => {
      init[f.varName] = initialValues[f.varName] || "";
    });
    return init;
  });

  useEffect(() => {
    const init = {};
    fields.forEach((f) => {
      const val = initialValues?.[f.varName];
      init[f.varName] = val !== undefined && val !== null ? val : "";
    });
    setValues(init);
  }, [fields, initialValues]);

  const handleChange = (varName, value) => {
    setValues((prev) => ({ ...prev, [varName]: value }));
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel(); // Zavolej callback pro zrušení
    }
    onClose(); // Zavři modal
  };

  const handleThirdButtonClick = () => {
    if (thirdButton === "Smazat") {
      setShowConfirm(true);
    } else {
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
            className={`modal-content ${fields.length > 5 ? "two-columns" : ""}`}
          >
            {fields.map((field, index) => {
              // Pro pole s dynamickými options použij předem načtená data
              const isDynamic =
                field.options &&
                typeof field.options === "object" &&
                !Array.isArray(field.options);
              const optionsList = isDynamic
                ? dynamicData?.data || []
                : Array.isArray(field.options)
                  ? field.options
                  : [];

              return (
                <div key={index} className="modal-field">
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
