import React, { useState } from "react";
import "./Modal.css";

const paymentMethods = [
  "hotovost",
  "platební karta",
  "převod na účet",
  "šek",
  "okamžitá QR platba",
];

export default function ModalPayment({
  defaultAmount = "",
  loading = false,
  onCancel,
  onPay,
}) {
  const [amount, setAmount] = useState(
    defaultAmount === "" ? "" : String(defaultAmount),
  );
  const [method, setMethod] = useState(paymentMethods[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedAmount = Number.parseFloat(String(amount).replace(",", "."));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      alert("Zadejte platnou částku.");
      return;
    }

    await onPay({
      amount: parsedAmount,
      method,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Platba</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-field">
              <label>Částka</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
              />
            </div>
            <div className="modal-field">
              <label>Forma úhrady</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                {paymentMethods.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} disabled={loading}>
              Zrušit
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Zpracovávám..." : "Zaplatit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
