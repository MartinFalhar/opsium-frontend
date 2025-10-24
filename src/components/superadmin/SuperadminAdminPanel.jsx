import React, { useState } from "react";
import "./Superadmin.css";

const API_URL = import.meta.env.VITE_API_URL;

function SuperadminAdminPanel() {
  const [searchClient, setSearchClient] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("Fin");
  const [surname, setSurname] = useState("Fal");
  const [email, setEmail] = useState("fin@seznam.cz");
  const [password, setPassword] = useState("123");
  const [passwordCheck, setPasswordCheck] = useState("123");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      alert("Hesla se neshodují");
      return;
    }
    const newAdmin = {
      name,
      surname,
      email,
      password,
      rights: 10,
      organization: surname + " Company",
      avatar: "default.png",
    };
    console.log(API_URL);
    try {
      const res = await fetch(`${API_URL}/register_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });

      if (res.ok) {
        alert("Úspěšně odesláno!");
        setFirstName("");
        setLastName("");
        setShowModal(false);
      } else {
        alert("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      alert("Server je nedostupný.");
    }

    console.log("Create new ADMIN");
  };

  return (
    <div className="superadmin-content-container ">
      <div className="search-container">
        <input
          className="client-search-input"
          type="text"
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
          placeholder="Hledej klienta"
        />
      </div>

      <h1>SettingsAccount - external module</h1>
      <button onClick={() => setShowModal(true)}>New ADMIN</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nový ADMIN účet</h2>

            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Jméno</label>
              <input
                id="name"
                type="text"
                placeholder="Jméno"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="surname">Přijmení</label>
              <input
                id="surname"
                type="text"
                placeholder="Příjmení"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
              <label htmlFor="email">Email (přihlašovací jméno)</label>
              <input
                id="email"
                type="email"
                placeholder="zadejte email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password">Heslo</label>
              <input
                id="password"
                type="password"
                placeholder="Zadejte heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="passwordCheck">Znovu zadejte heslo</label>
              <input
                id="passwordCheck"
                type="password"
                placeholder="Kontrolně znovu zadejte heslo"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                required
              />
              <div className="button-group">
                <button type="button" onClick={() => setShowModal(false)}>
                  Zrušit
                </button>
                <button type="submit">Odeslat</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminAdminPanel;
