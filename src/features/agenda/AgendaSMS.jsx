import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AgendaSMS() {
  const [phone, setPhone] = useState("+420605829358");
  const [text, setText] = useState(`Vážený kliente, zde najdete informace ke kontaktním čočkám: https://www.arteoptik.cz/blog/mam-jednorazove-cocky-z-arte-optik S pozdravem, tým ArteOptik.cz`);
  const [text2, setText2] = useState(`Vážený kliente, zde najdete informace ke kontaktním čočkám: https://www.arteoptik.cz/blog/mam-cocky-z-arte-optik S pozdravem, tým ArteOptik.cz`);
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
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <h3>Jednodenní kontaktní čočky SMS</h3>
          <input
            placeholder="Telefon (např. 420777123456)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            placeholder="Text SMS"
            style={{
              width:"600px",
              height:"100px",
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={sendSms}>Odeslat</button>

          <p>{status}</p>
        </div>
        <div className="input-panel">
          <h3>14D/30D kontaktní čočky SMS</h3>
          <input
            placeholder="Telefon (např. 420777123456)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            placeholder="Text SMS"
            style={{
              width:"600px",
              height:"100px",
            }}
            value={text2}
            onChange={(e) => setText2(e.target.value)}
          />
          <button onClick={sendSms}>Odeslat</button>

          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}

export default AgendaSMS;
