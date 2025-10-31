import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../../styles/styles.css";
import logo from "../../styles/images/opsium-logo-black.png";
import { useUser } from "../../context/UserContext";
import PuffLoaderSpinnerDark from "../../components/loader/PuffLoaderSpinnerDark.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setMembers } = useUser();
  const [heroImg, setHeroImg] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let heroImgID = "";

  useEffect(() => {
    heroImgID = Math.floor(Math.random() * 6 + 1);

    //nacteni info o uvodnim obrazku
    heroImgInfoLoad();
    //nacteni obrazku ze serveru
    setImageSrc(
      `${API_URL}/hero_img/${heroImgID < 10 ? `0${heroImgID}` : `${heroImgID}`}`
    );
  }, []);

  const heroImgInfoLoad = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/hero_img_info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: heroImgID }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setHeroImg(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Chyba při načítání:", err);
      setError("Chyba při načítání dat.");
    } finally {
      setIsLoading(false); // 👈 vypneme loader
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const loadMembers = async () => {
      // zapneme loader
      try {
        const res = await fetch(`${API_URL}/admin/members_list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization: data.id }),
        });
        const dataMember = await res.json();

        if (res.ok) {
          console.log(dataMember);
          setMembers(dataMember);
        } else {
          setError(data.message);
          console.error("Error loading users:", data.message);
        }
      } catch (err) {
        console.error("Chyba při načítání:", err);
        setError("Chyba při načítání dat.");
      } finally {
        // vypneme loader
        setIsLoading(false);
      }
    };

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      // localStorage.setItem("token", data.token);
      // nebo cookie, podle implementace
      console.log(data);
      await setUser(data);
      //Pokud je vše v pořádku, stáhnu si
      //seznam členů pro daný USER-ACCOUNT
      await loadMembers(data.id);
      // Zkontrolujeme, jestli se uložil do localStorage
      console.log(
        "Co je v localStorage po přihlášení USER:",
        JSON.parse(localStorage.getItem("user"))
      );

      navigate("/clients"); // přesměrování na domovskou stránku s právy
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <img className="login-logo" src={logo} />
        <form className="login-form" onSubmit={handleSubmit}>
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
          <PuffLoaderSpinnerDark active={isLoading} />

          {!isLoading && (
            <button type="submit" style={{ marginTop: "30px" }}>
              Přihlásit se
            </button>
          )}
          <div className="error">{error && <p>{error}</p>}</div>
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
          <h2>
            {heroImg &&
              (Array.isArray(heroImg)
                ? heroImg[0]?.hero_img_label
                : heroImg.hero_img_label)}
          </h2>

          <p>
            {heroImg &&
              (Array.isArray(heroImg)
                ? heroImg[0]?.hero_img_desc
                : heroImg.hero_img_desc)}
          </p>
        </div>
        {isLoading &&

          <div className="loader-image">
          <PuffLoaderSpinnerLarge active={isLoading} />
          <p>Aktivuji databázi, čekej...</p>
        </div>
        }
      </div>
    </div>
  );
}

export default Login;
