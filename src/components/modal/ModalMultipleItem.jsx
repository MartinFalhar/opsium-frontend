import React, { useState, useEffect } from "react";
import ConfirmDelete from "./ConfirmDelete";

export default function ModalMultipleItem({
  fields,
  predefinedValues = [{}, {}],
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
  const [itemsList, setItemsList] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);

  // Aktualizace values při změně predefinedValues nebo fields
  useEffect(() => {
    // Inicializace itemsList s jedním prázdným prvkem
    setItemsList([{ ...predefinedValues[1] }]);
    // Inicializace dynamicFields se základními fields od indexu 3 dál
    setDynamicFields([fields.slice(3)]);
  }, []);

  // Aktualizace values při změně predefinedValues nebo fields
  useEffect(() => {
    const init = {};
    fields.forEach((f, index) => {
      // První 3 položky berou hodnoty z predefinedValues[0], zbytek z predefinedValues[1]
      const sourceIndex = index < 3 ? 0 : 1;
      const val = predefinedValues?.[sourceIndex]?.[f.varName];
      init[f.varName] = val !== undefined && val !== null ? val : "";
    });
    setValues(init);
  }, [fields, predefinedValues]);

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

  const handleAddItem = () => {
    // Přidej nový prvek identický s predefinedValues[1] s quantity = 1
    const newItem = { ...predefinedValues[1], quantity: 1 };
    setItemsList((prev) => [...prev, newItem]);

    // Přidej nové fields se stejnou strukturou jako fields od indexu 3 dál
    const newGroupIndex = dynamicFields.length;
    setDynamicFields((prev) => [...prev, fields.slice(3)]);

    // Nastav hodnoty pro nový řádek včetně quantity = 1
    const newValues = {};
    fields.slice(3).forEach((field) => {
      const uniqueVarName = `${field.varName}_${newGroupIndex}`;
      newValues[uniqueVarName] =
        field.varName === "quantity" ? 1 : (newItem[field.varName] ?? "");
    });
    setValues((prev) => ({ ...prev, ...newValues }));
  };

  const handleRemoveItem = (groupIndex) => {
    // Odebere prvek z obou polí
    setItemsList((prev) => prev.filter((_, index) => index !== groupIndex));
    setDynamicFields((prev) => prev.filter((_, index) => index !== groupIndex));
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
      <div className="modal modal-wide">
        <h2>Zadej údaje</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
            setTimeout(onClose, 2);
          }}
        >
          {/* První kontejner - první 3 položky vedle sebe */}
          <div className="modal-content two-columns three-columns">
            {fields.slice(0, 3).map((field, index) => {
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
                  className={`modal-field ${
                    field.input === "hidden" ? "modal-field-hidden" : ""
                  }`}
                >
                  <label>
                    {field.label}
                    {field.required && (
                      <span className="required-star"> *</span>
                    )}
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
                      disabled={field.disabled || field.readOnly}
                    >
                      <option value="">-- Vyberte --</option>
                      {optionsList.map((option, i) => {
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
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Druhý kontejner - zbývající položky vedle sebe */}

          {dynamicFields.map((fieldGroup, groupIndex) => (
            <div
              key={groupIndex}
              className={`modal-dynamic-row ${
                groupIndex > 0 ? "has-margin" : ""
              }`}
              style={{
                gridTemplateColumns: `repeat(${fieldGroup.length}, 1fr) auto`,
              }}
            >
              {fieldGroup.map((field, index) => {
                // Vytvoř unikátní varName pro každou skupinu (kromě první)
                const uniqueVarName =
                  groupIndex > 0
                    ? `${field.varName}_${groupIndex}`
                    : field.varName;
                const actualIndex = index + 3;
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
                    key={actualIndex}
                    className={`modal-field ${
                      field.input === "hidden" ? "modal-field-hidden" : ""
                    }`}
                  >
                    {groupIndex === 0 && (
                      <label>
                        {field.label}
                        {field.required && (
                          <span className="required-star"> *</span>
                        )}
                      </label>
                    )}
                    {(field.options && Array.isArray(field.options)) ||
                    (field.options &&
                      typeof field.options === "object" &&
                      !Array.isArray(field.options)) ? (
                      <select
                        value={values[uniqueVarName] ?? ""}
                        onChange={(e) => {
                          if (!field.readOnly) {
                            handleChange(uniqueVarName, e.target.value);
                          }
                        }}
                        required={field.required}
                        disabled={field.disabled || field.readOnly}
                      >
                        <option value="">-- Vyberte --</option>
                        {optionsList.map((option, i) => {
                          const isObject =
                            typeof option === "object" && option !== null;
                          return (
                            <option
                              key={i}
                              value={isObject ? option.id : option}
                            >
                              {isObject ? option.nick : option}
                            </option>
                          );
                        })}
                      </select>
                    ) : field.input === "textarea" ? (
                      <textarea
                        value={values[uniqueVarName] ?? ""}
                        onChange={(e) =>
                          handleChange(uniqueVarName, e.target.value)
                        }
                        required={field.required}
                        readOnly={field.readOnly}
                        disabled={field.disabled}
                        rows={field.rows || 3}
                      />
                    ) : field.input === "message" ? (
                      <h2>{values[uniqueVarName] ?? ""}</h2>
                    ) : (
                      <input
                        type={field.input || "text"}
                        value={values[uniqueVarName] ?? ""}
                        onChange={(e) =>
                          handleChange(uniqueVarName, e.target.value)
                        }
                        required={field.required}
                        autoFocus={actualIndex === 0}
                        readOnly={field.readOnly}
                        disabled={field.disabled}
                      />
                    )}
                  </div>
                );
              })}
              {/* Tlačítko - pro odebrání řádku (jen pro řádky kromě prvního) */}
              {groupIndex > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(groupIndex)}
                  className="modal-button-remove"
                >
                  −
                </button>
              )}
            </div>
          ))}
          <div className="modal-button-add-container">
            <button type="button" onClick={handleAddItem}>
              +
            </button>
          </div>

          <div className="modal-actions">
            {thirdButton !== null && predefinedValues?.[0]?.name !== "" && (
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
