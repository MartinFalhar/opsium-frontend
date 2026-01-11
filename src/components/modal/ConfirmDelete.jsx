import React from "react";

export default function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Potvrzení smazání</h2>
        <div className="modal-content">
          <p>Opravdu si přejete tuto položku smazat?</p>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            Ne
          </button>
          <button className="button-delete" type="button" onClick={onConfirm}>
            Ano
          </button>
        </div>
      </div>
    </div>
  );
}
