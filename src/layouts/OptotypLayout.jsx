import React from "react";
import { Outlet } from "react-router-dom";
import "./OptotypLayout.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

function OptotypLayout() {
  const navigate = useNavigate();

  useInputHandler({
    onEsc: () => {
      console.log("ESC zmáčknut");

      navigate("/optotyp"); // přechod na stránku optotypu
    },
    onClickLeft: () => console.log("Klik v levé půlce"),
    onClickRight: () => console.log("Klik v pravé půlce"),
    onWheelUp: () => console.log("Scroll kolečkem nahoru"),
    onWheelDown: () => console.log("Scroll kolečkem dolů"),
  });

  return (
    <div className="optotyp-testing-container">
      OPTOTYP LAYOUT
      {/* This is where the Optotyp component will be rendered */}
      {/* <Outlet /> */}
    </div>
  );
}

export default OptotypLayout;
