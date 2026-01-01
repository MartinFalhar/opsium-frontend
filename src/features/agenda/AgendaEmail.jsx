import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AgendaEmail() {
  const [form, setForm] = useState({ name: "Opsium.cz (Martin)", email: "info@opsium.cz", message: "Určeno do psích tlapek!", invoiceId: 7 });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Kam poslat</h1>
      <input name="email" value={form.email} placeholder="E-mail" onChange={handleChange} />
      <h1>Předmět emailu</h1>
      <input name="name" value={form.name} placeholder="Jméno" onChange={handleChange} />
      <h1>Text emailu</h1>
      <textarea name="message" value={form.message} placeholder="Zpráva" onChange={handleChange} />
      <button type="submit">Odeslat</button>
    </form>
  );
}

export default AgendaEmail;
