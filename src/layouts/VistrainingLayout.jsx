import React from "react";
import { Outlet } from "react-router-dom";
import "./VistrainingLayout.css"; 
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import magentaImg from "../styles/images/magenta.png";
import cyanImg from "../styles/images/cyan.png";
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
  
  const location = useLocation();

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
    console.log(`${location.pathname}`)
  }, [imgDistance]);

  return (
    <div className="visual-training-container">
      <img className="cyan" src={magentaImg} style={{
        height:"250px",width:"300px" ,
        transform: `translateX(${-imgDistance}px)`,
        }}/>
      <img className="magenta" src={cyanImg} style={{
        height:"250px",width:"300px" ,
         transform: `translateX(${+imgDistance}px)`,
         }}/>



    </div>
  );
}

export default VistrainingLayout;