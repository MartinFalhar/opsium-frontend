import React from "react";
import { Outlet } from "react-router-dom";
import "./OptotypLayout.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function useInputHandler({
  onEsc,
  onClickLeft,
  onClickRight,
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
  }, [onEsc, onClickLeft, onClickRight, onWheelUp, onWheelDown]);
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
  
  const baseColor = "0,0,0";
  const baseSize = 100; // základní velikost písma
  const [textOpacity, setTextOpacity] = useState(1); // React state pro opacity
  const [textColor, setTextColor] = useState(`rgba(${baseColor}, ${textOpacity})`); // React state pro barvu textu
  const [textSize, setTextSize] = useState(baseSize); // React state pro velikost písma
  const navigate = useNavigate();

  useInputHandler({
    onEsc: () => {
      console.log("ESC zmáčknut");
      navigate("/optotyp"); // přechod na stránku optotypu
    },
    onClickLeft: () => {
      setTextSize((prev) => Math.max(prev - 10, 20)); // zmenšení velikosti písma
      console.log("Klik v levé půlce")},
    onClickRight: () => {
      setTextSize((prev) => Math.min(prev + 10, 200)); // zvětšení velikosti písma
      console.log("Klik v pravé půlce")},
    onWheelUp: () => {
      setTextOpacity((prev) => Math.min(prev + 0.1, 1));
      setTextColor(`rgba(${baseColor}, ${textOpacity})`); // aktualizace barvy textu
      console.log("Scroll kolečkem nahoru")
      console.log("Aktuální opacity:", textOpacity);
      console.log("Aktuální barva textu:", textColor);
    },
    onWheelDown: () => {
      setTextOpacity((prev) => Math.max(prev - 0.1, 0));
      setTextColor(`rgba(${baseColor}, ${textOpacity})`); // aktualizace barvy textu
      console.log("Scroll kolečkem dolů")},
  });

  return (
    <div className="optotyp-testing-container" >
      <p style ={{ color: textColor, fontSize: textSize }}>{generateSloanLetters()}</p>
      {/* This is where the Optotyp component will be rendered */}
      {/* <Outlet /> */}
      <p className="info">{textSize}/{Math.floor(textOpacity*10)}</p>
    </div>
  );
}

export default OptotypLayout;
