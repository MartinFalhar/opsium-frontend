import React, { useState } from "react";

export default function Modal({ fields, onSubmit, onClose }) {
  const [values, setValues] = useState(() => {
    const init = {};
    fields.forEach((f) => (init[f.varName] = ""));
    return init;
  });

  const handleChange = (varName, value) => {
    setValues((prev) => ({ ...prev, [varName]: value }));
  };


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
                <input
                  type={field.input || "text"}
                  value={values[field.varName]}
                  onChange={(e) => handleChange(field.varName, e.target.value)}
                  required={field.required}
                  autoFocus={index === 0}
                />
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button type="submit">Potvrdit</button>
            <button type="button" onClick={onClose}>Zavřít</button>
          </div>
        </form>
      </div>
    </div>
  );
}
