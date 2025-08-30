import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../../styles/styles.css";
import logo from "../../styles/images/opsium-logo-black.png";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      // localStorage.setItem("token", data.token);
      // nebo cookie, podle implementace
      setUser(data);
      console.log("FRNT Response data:", data);

      // Zkontrolujeme, jestli se uložil do localStorage
      console.log(
        "Co je v localStorage po uložení usera:",
        JSON.parse(localStorage.getItem("user"))
      );

      navigate("/"); // přesměrování na domovskou stránku s právy
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="card">
      <img className="login-logo" src={logo} />
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
        <button type="submit" style={{ marginTop: "30px" }}>
          Přihlásit se
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
