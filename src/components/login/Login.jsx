import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../../styles/styles.css";
import logo from "./opsium-logo-blk.png";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
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
    <div className="card">
      <form onSubmit={handleSubmit}>
        <img src={logo} style={{ width: "150px", objectFit: "contain" }} />
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
        <button className="button-login" type="submit">Přihlásit se</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
