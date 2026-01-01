import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AgendaSMS() {
  const [phone, setPhone] = useState("+420605829358");
  const [text, setText] = useState("OPSIUM - Testovací SMS zpráva");
  const [status, setStatus] = useState("");

  const sendSms = async () => {
    setStatus("Odesílám...");

    try {
      const res = await fetch(`${API_URL}/sms/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          text,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("SMS byla odeslána ✅");
      } else {
        setStatus(`Chyba: ${data.error}`);
      }
    } catch (err) {
      setStatus("Chyba spojení");
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>Odeslat SMS</h3>

      <input
        placeholder="Telefon (např. 420777123456)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <textarea
        placeholder="Text SMS"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendSms}>Odeslat</button>

      <p>{status}</p>
    </div>
  );
}

export default AgendaSMS;
