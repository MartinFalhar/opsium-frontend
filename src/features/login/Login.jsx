import React, { use, useEffect } from "react";
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

  const [heroImgID, setHeroImgID] = useState(() =>
    Math.floor(Math.random() * 6 + 1)
  );

  const imageHeroText = [
    { title: "Opsium", desc: "A digi-medicine for an eye-optics" },
    { title: "Optical Illusion", desc: "Mind-blowing images" },
    { title: "Eye Beauty", desc: "The iris synechia with the lens" },
    { title: "Eye diagnostic", desc: "It was a hard day today!" },
    { title: "Eye beauty", desc: "Autumn in the eye" },
    { title: "Eye diagnostic", desc: "The stroma world of the cornea" },
    { title: "Eye diagnostic", desc: "Fluorescein symphony" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newId = Math.floor(Math.random() * 6 + 1);
      setHeroImgID(newId);
    }, 5000); // každých 5 sekund
    // heroImgID = Math.floor(Math.random() * 6 + 1);
    //nacteni info o uvodnim obrazku
    // heroImgInfoLoad();
    //nacteni obrazku ze serveru
    // setImageSrc(
    //   `${API_URL}/hero_img/${heroImgID < 10 ? `0${heroImgID}` : `${heroImgID}`}`
    // );
    //nacteni obrazku ze frontendu
    // frontend/uploads/hero_img/hero01.png
    // const interval = setInterval(() => {
    //   heroImgID = Math.floor(Math.random() * 6 + 1);
    // }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filename = heroImgID < 10 ? `0${heroImgID}` : heroImgID;
    const newImageSrc = `../../uploads/hero_img/hero${filename}.png`;
    setImageSrc(newImageSrc);
    // heroImgInfoLoad(heroImgID);
  }, [heroImgID]);

  //   setImageSrc(
  //     `../../uploads/hero_img/hero${
  //       heroImgID < 10 ? `0${heroImgID}` : `${heroImgID}`
  //     }.png`
  //   );
  //   heroImgInfoLoad();
  //   console.log(imageSrc);

  //   return () => clearInterval(interval);
  // }, []);

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

    const loadMembers = async (adminID) => {
      try {
        const res = await fetch(`${API_URL}/admin/members_list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization: adminID }),
        });
        const dataMember = await res.json();

        if (res.ok) {
          setMembers(dataMember);
        } else {
          setError(dataMember.message);
          console.error("Error loading users:", error);
        }
      } catch (err) {
        console.error("Chyba při načítání:", err);
        setError("Chyba při načítání dat.");
      } finally {
        // vypneme loader
        setIsLoading(false);
      }
    };

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // localStorage.setItem("token", data.token);
        // nebo cookie, podle implementace

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
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se načíst klienty.");
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
          {/* <h2>
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
          </p> */}
          <h2>
            {" "}
            {
              imageHeroText[
                (heroImgID - 1 + imageHeroText.length) % imageHeroText.length
              ]?.title
            }{" "}
          </h2>
          <p>
            {" "}
            {
              imageHeroText[
                (heroImgID - 1 + imageHeroText.length) % imageHeroText.length
              ]?.desc
            }{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
