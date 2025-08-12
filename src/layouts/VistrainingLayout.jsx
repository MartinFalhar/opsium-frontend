import React from "react";
import { Outlet } from "react-router-dom";
import "./VistrainingLayout.css"; 
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";


function useInputHandler({
  onEsc,
  onArrowLeft,
  onArrowRight,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onEsc && onEsc(e);
      } else if (e.key === "ArrowLeft") {
        onArrowLeft && onArrowLeft(e);
      } else if (e.key === "ArrowRight") {
        onArrowRight && onArrowRight(e);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEsc, onArrowLeft, onArrowRight]);
}

function VistrainingLayout() {
  const [history, setHistory] = useState([]);
  const [imgDistance, setImgDistance] = useState(0);
  const navigate = useNavigate();

    useInputHandler({
    onEsc: () => {
      console.log("ESC zmáčknut");
      navigate("/visual-training", { state: { history } }); // přechod na stránku optotypu
    },
    onArrowLeft: () => {
      setImgDistance((prev) => prev - 10);
      console.log("LEFT")
      console.log({imgDistance});
    },
    onArrowRight: () => {
      setImgDistance((prev) => prev + 10);
      console.log("RIGHT");
      console.log({imgDistance});
    }
  });

   useEffect(() => {
    console.log("Aktuální imgDistance:", imgDistance);
    setHistory((prev) => [...prev, imgDistance]);
    console.log("Aktuální historie:", history);
  }, [imgDistance]);

  return (
    <div className="visual-training-container">
      <img className="cyan" src="../../src/styles/images/cyan.png" style={{
        height:"250px", 
        transform: `translateX(${-imgDistance}px)`,
        }}/>
      <img className="magenta" src="../../src/styles/images/magenta.png" style={{
        height:"250px",
         transform: `translateX(${+imgDistance}px)`,
         }}/>




    </div>
  );
}

export default VistrainingLayout;