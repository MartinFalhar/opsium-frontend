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

  const { setUser, setMembers, setActiveId } = useUser();
  const [heroImg, setHeroImg] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [heroImgID, setHeroImgID] = useState(() =>
    Math.floor(Math.random() * 15 + 1),
  );

  const imageHeroText = [
    { title: "Opsium", desc: "A digi-medicine for an eye-optics" },
    { title: "Optical Illusion", desc: "Mind-blowing images" },
    { title: "Eye Beauty", desc: "The iris synechia with the lens" },
    { title: "Eye Diagnostic", desc: "It was a hard day today!" },
    { title: "Eye Beauty", desc: "Autumn in the eye" },
    { title: "Eye Diagnostic", desc: "The stroma world of the cornea" },
    { title: "Eye Diagnostic", desc: "Fluorescein symphony" },
    { title: "Tear Layers Deficit", desc: "Like Jupiter and Earth" },
    { title: "Lens World", desc: "The symphony of engravings" },
    { title: "Contact Lens", desc: "Smooth but tear" },
    { title: "Contact Lens", desc: "The color beauty from the near" },
    { title: "Eye Beauty", desc: "The magic of the reflection" },
    { title: "Lens World", desc: "Geographical layer disaster" },
    { title: "Glasses Fate", desc: "The screw is always right!" },
    { title: "Glasses Fate", desc: "Is one enough?" },
    { title: "Lens Rainbow", desc: "Colorfull beauty in the pressure" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newId = Math.floor(Math.random() * 15 + 1);
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
    const newImageSrc = `./hero_img/hero${filename}.png`;
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
          setActiveId((prev) => ({
            ...prev,
            member_id: dataMember[0].id,
          }));
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

    const loadOrganizationInfo = async (organization_id) => {
      try {
        const res = await fetch(`${API_URL}/admin/organizationInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization_id: organization_id }),
        });
        const dataOrganization = await res.json();

        if (res.ok) {
          setUser((prev) => {
            const next = {
              ...(prev || {}), // prev může být null/undefined
              organization_name: dataOrganization?.name ?? "",
              organization_street: dataOrganization?.street ?? "",
              organization_city: dataOrganization?.city ?? "",
              organization_ico: dataOrganization?.ico ?? "",
              organization_dic: dataOrganization?.dic ?? "",
              organization_postal_code: dataOrganization?.postal_code ?? "",
              organization_country: dataOrganization?.country ?? "",
              organization_phone: dataOrganization?.phone ?? "",
              organization_email: dataOrganization?.email ?? "",
            };
            return next;
          });
        } else {
          setError(dataOrganization.message);
          console.error("Error loading organization info:", error);
        }
      } catch (err) {
        console.error("Chyba při načítání:", err);
        setError("Chyba při načítání dat.");
      } finally {
        // vypneme loader
        setIsLoading(false);
      }
    };

    const loadBranchInfo = async (user_id) => {
      try {
        const res = await fetch(`${API_URL}/admin/branchInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user_id }),
        });
        const dataBranch = await res.json();

        if (res.ok) {
          setUser((prev) => {
            const next = {
              ...(prev || {}), // prev může být null/undefined
              branch_id: dataBranch?.id ?? 0,
              branch_name: dataBranch?.name ?? "",
              branch_street: dataBranch?.street ?? "",
              branch_city: dataBranch?.city ?? "",
              branch_ico: dataBranch?.ico ?? "",
              branch_dic: dataBranch?.dic ?? "",
              branch_postal_code: dataBranch?.postal_code ?? "",
              branch_country: dataBranch?.country ?? "",
              branch_phone: dataBranch?.phone ?? "",
              branch_email: dataBranch?.email ?? "",
            };
            return next;
          });
        } else {
          setError(dataBranch.message);
          console.error("Error loading branch info:", error);
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

      const user = await res.json();
      if (res.ok) {
        // Uložíme JWT token do localStorage
        if (user.token) {
          localStorage.setItem("authToken", user.token);
          console.log("JWT token byl uložen");
        }

        await setUser(user);
        //Pokud je vše v pořádku, stáhnu si
        //seznam členů pro daný USER-ACCOUNT

        //******** */
        // await loadBranch(data.organization_id);
        //******** */

        await loadMembers(user.id);

        await loadOrganizationInfo(user.organization_id);

        await loadBranchInfo(user.id);

        // Zkontrolujeme, jestli se uložil do localStorage
        console.log(
          "Co je v localStorage po přihlášení USER:",
          JSON.parse(localStorage.getItem("user")),
        );

        navigate("/dashboard"); // přesměrování na domovskou stránku s právy
      } else {
        setError(user.message);
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
          {isLoading && (
            <p className="p-dbf-info">Chvíli strpení, aktivuji databázi..</p>
          )}
          {isLoading && (
            <p className="p-dbf-info">Může to trvat více jak 30 sekund. :-)</p>
          )}

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

      <div className="login-contact-panel">
        <p>Máte dotaz k OPSIUM?</p>
        <p>
          Napište nám na <a href="mailto:info@opsium.cz">info@opsium.cz</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
