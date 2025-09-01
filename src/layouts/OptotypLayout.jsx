import React from "react";
import { Outlet } from "react-router-dom";
import "./OptotypLayout.css";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function useInputHandler({
  onEsc,
  onClickLeft,
  onClickRight,
  changeType,
  onWheelUp,
  onWheelDown,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onEsc && onEsc(e);
      }
    }

    function handleClick(e) {
      const half = window.innerWidth / 2;

      if (e.clientY < 50) {
        changeType && changeType(e);
      }

      if (e.clientX < half) {
        onClickLeft && onClickLeft(e);
      } else {
        onClickRight && onClickRight(e);
      }
    }

    function handleWheel(e) {
      if (e.deltaY < 0) {
        // scroll nahoru
        onWheelUp && onWheelUp(e);
      } else if (e.deltaY > 0) {
        // scroll dolů
        onWheelDown && onWheelDown(e);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [onEsc, onClickLeft, onClickRight, changeType, onWheelUp, onWheelDown]);
}

function generateSloanLetters() {
  const sloanSet = ["C", "D", "H", "K", "N", "O", "R", "S", "V", "Z"];
  const result = [];
  const tempSet = [...sloanSet]; // Vytvoří kopii pole, aby se neupravovalo originální

  for (let i = 0; i < 5; i++) {
    // Generuje náhodný index
    const randomIndex = Math.floor(Math.random() * tempSet.length);

    // Přidá náhodné písmeno do výsledného pole
    result.push(tempSet[randomIndex]);

    // Odstraní vybrané písmeno z dočasného pole, aby se neopakovalo
    tempSet.splice(randomIndex, 1);
  }

  return result;
}

function OptotypLayout() {
  // Získání parametru sampleWidth z URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mm2px = queryParams.get("mm2px");
  const viewDistance = queryParams.get("viewDistance");

  const baseColor = "0,0,0";
  const [baseSize, setBaseSize] = useState(1); // základní velikost písma, použita decimální notace
  const [textOpacity, setTextOpacity] = useState(1); // React state pro opacitu
  const [textColor, setTextColor] = useState(
    `rgba(${baseColor}, ${textOpacity})`
  ); // React state pro barvu textu
  const [textSize, setTextSize] = useState(baseSize); // React state pro velikost písma
  const [type, setType] = useState(1); // typ optotypu, default sloan
  const navigate = useNavigate();

  useInputHandler({
    onEsc: () => {
      console.log("ESC zmáčknut");
      navigate("/optotyp"); // přechod na stránku optotypu
    },
    onClickLeft: () => {
      setBaseSize((prev) => Math.max(prev - 0.1, 0.1)); // zmenšení velikosti písma
      console.log("Klik v levé půlce");
    },
    onClickRight: () => {
      setBaseSize((prev) => Math.min(prev + 0.1, 2)); // zvětšení velikosti písma
      console.log("Klik v pravé půlce");
    },
    onWheelUp: () => {
      setTextOpacity((prev) => Math.min(prev + 0.1, 1));
      setTextColor(`rgba(${baseColor}, ${textOpacity})`); // aktualizace barvy textu
      console.log("Scroll kolečkem nahoru");
      console.log("Aktuální opacity:", textOpacity);
      console.log("Aktuální barva textu:", textColor);
    },
    onWheelDown: () => {
      setTextOpacity((prev) => Math.max(prev - 0.1, 0));
      setTextColor(`rgba(${baseColor}, ${textOpacity})`); // aktualizace barvy textu
      console.log("Scroll kolečkem dolů");
    },
    changeType: () => {
      setType((prev) => (prev === 1 ? 2 : 1)); // přepínání mezi typy optotypu
    },
  });

  /* --- Výpočet výšky optotypu pro zadanou vzdálenost --- */
  function letterSize(viewDistance) {
    // úhel 5 arcminutes -> 5/60 degrees
    const degrees = 5 / 60;
    const radians = (degrees * Math.PI) / 180;
    // výška znaku v metrech
    const heightMeters = viewDistance * Math.tan(radians) * (1 / baseSize);
    return heightMeters * 1000; // mm
  }
  //DOTS ASTIGMATISM TEST
  // vykreslení bodů do kruhu

  /* --- Funkce pro výpočet úhlu a pozic --- */
  function generateCircleCoords(count, radius) {
    const coords = [];
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count; // úhel v radiánech
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      coords.push([x, y]);
    }
    for (let i = 0; i < 6; i++) {
      const angle = (2 * Math.PI * i) / 6; // úhel v radiánech
      const x = 50 * Math.cos(angle);
      const y = 50 * Math.sin(angle);
      coords.push([x, y]);
    }
    coords.push([0, 0]); // středový bod
    return coords;
  }

  const container = document.getElementById("circle");
  const coords = generateCircleCoords(14, 100);
  const centerX = 150;
  const centerY = 150;

  const step = 35; // vzdálenost mezi body

  return (
    <div className="optotyp-testing-container">
      {type === 1 ? (
        <>
          <p
            style={{
              color: textColor,
              fontSize: letterSize(viewDistance) * mm2px,
            }}
          >
            {generateSloanLetters()}
          </p>

          <p className="info" style={{ color: "grey", fontSize: "15px" }}>
            {" "}
            {baseSize.toFixed(2)}/{Math.floor(textOpacity * 10)}
          </p>
        </>
      ) : (
        <div
          id="circle"
          style={{
            position: "relative",
            width: "300px",
            height: "300px",
            margin: "20px auto",
          }}
        >
          {coords.map(([x, y], i) => (
            <div
              key={i}
              className="dot"
              style={{
                backgroundColor: textColor,
                position: "absolute",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "black",
                left: centerX + x,
                top: centerY + y,
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OptotypLayout;
