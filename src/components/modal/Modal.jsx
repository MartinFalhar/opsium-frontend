import React, { useState } from "react";
import ConfirmDelete from "./ConfirmDelete";

export default function Modal({ fields, initialValues = {}, onSubmit, onClose, onCancel, onDelete }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [values, setValues] = useState(() => {
    const init = {};
    fields.forEach((f) => {
      init[f.varName] = initialValues[f.varName] || "";
    });
    return init;
  });

  const handleChange = (varName, value) => {
    setValues((prev) => ({ ...prev, [varName]: value }));
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel(); // Zavolej callback pro zrušení
    }
    onClose(); // Zavři modal
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowConfirmDelete(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  if (showConfirmDelete) {
    return <ConfirmDelete onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />;
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
          <div className="modal-content">
            {fields.map((field, index) => (
              <div key={index} className="modal-field">
                <label>
                  {field.label}
                  {field.required && <span style={{ color: "red" }}> *</span>}
                </label>
                {field.options ? (
                  <select
                    value={values[field.varName]}
                    onChange={(e) => handleChange(field.varName, e.target.value)}
                    required={field.required}
                    disabled={field.disabled}
                    style={field.disabled ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                  >
                    <option value="">-- Vyberte --</option>
                    {field.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.input === "textarea" ? (
                  <textarea
                    value={values[field.varName]}
                    onChange={(e) => handleChange(field.varName, e.target.value)}
                    required={field.required}
                    readOnly={field.readOnly}
                    disabled={field.disabled}
                    rows={field.rows || 3}
                    style={field.readOnly || field.disabled ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                  />
                ) : (
                  <input
                    type={field.input || "text"}
                    value={values[field.varName]}
                    onChange={(e) => handleChange(field.varName, e.target.value)}
                    required={field.required}
                    autoFocus={index === 0}
                    readOnly={field.readOnly}
                    disabled={field.disabled}
                    style={field.readOnly || field.disabled ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button className="button-delete" type="button" onClick={handleDeleteClick}>
              Smazat
            </button>
            <button type="button" onClick={handleClose}>
              Zavřít
            </button>
            <button type="submit">Uložit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
