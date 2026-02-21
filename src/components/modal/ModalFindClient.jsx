import React, { useState } from "react";
import { useOrdersFindClient } from "../../hooks/useOrdersFindClient.js";
import "./Modal.css";

export default function ModalFindClient({ onClose, onCancel }) {
  const [surname, setSurname] = useState("");
  const [result, setResult] = useState(null);
  const { findClient, loading, error } = useOrdersFindClient();

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!surname.trim()) {
      return;
    }

    try {
      const data = await findClient({ surname: surname.trim() });
      setResult(data);
    } catch {
      setResult(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Najít klienta</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-field">
              <label>Příjmení</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                autoFocus
              />
            </div>

            {result && (
              <h3>
                {result.exists
                  ? `Klient existuje (${result.clients.length}).`
                  : "Klient neexistuje."}
              </h3>
            )}

            {error && <p>{error}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose}>
              Zavřít
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Hledám..." : "Hledat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
