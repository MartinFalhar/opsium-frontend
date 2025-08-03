import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Response data:", data);
    if (res.ok) {
      localStorage.setItem("token", data.token); // nebo cookie, podle implementace
      navigate("/footer");
    } else {
      setError(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Heslo"
      />
      <button type="submit">Přihlásit se</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default Header;
