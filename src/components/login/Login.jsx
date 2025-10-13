import React, { useEffect } from "react";
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
  const [heroImg, setHeroImg] = useState(null);

  const heroImgID = Math.floor(Math.random() * 3 + 1);
  console.log("Hero image ID:", heroImgID);

  const [imageSrc, setImageSrc] = useState(null);

  const heroImgInfoLoad = async () => {
    const res = await fetch(`${API_URL}/hero_img_info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: heroImgID }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      console.log("xxxxxx hero image data:", data);
      setHeroImg(data);
    } else {
      setError(data.message);
    }
  };

  useEffect(() => {
    heroImgInfoLoad();
    // heroImgLoad();
    setImageSrc(
      `${API_URL}/hero_img/${heroImgID < 10 ? `0${heroImgID}` : `${heroImgID}`}`
    );
  }, []);

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
    <div className="login-container">
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

      <div
        className="login-hero-image"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hero-text">
          <h1>
            {heroImg &&
              (Array.isArray(heroImg)
                ? heroImg[0]?.hero_img_label
                : heroImg.hero_img_label)}
          </h1>
          <p>
            {heroImg &&
              (Array.isArray(heroImg)
                ? heroImg[0]?.hero_img_desc
                : heroImg.hero_img_desc)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
