import { useState, useEffect, useRef } from "react";
// import "./OptometryRefractionARKz.css";
import copyIcon from "../../styles/svg/copy.svg";

function OptometryRefractionARK({
  isActive,
  setActiveModul,
  itemValues,
  onChange,
}) {
  const [values, setValues] = useState(itemValues);

  // refs pro focus management (např. ArrowUp/ArrowDown)
  const pSphRef = useRef(null);
  const pCylRef = useRef(null);
  const pAxRef = useRef(null);
  const lSphRef = useRef(null);
  const lCylRef = useRef(null);
  const lAxRef = useRef(null);

  // synchronizace se změnami z rodiče
  useEffect(() => {
    setValues(itemValues);
  }, [itemValues]);

  const handleChange = (key, value) => {
    const newData = { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData);
  };

  // příklad: přeskakování kurzoru šipkami
  const handleKeyDown = (e, nextRef, key) => {
    if (e.key === "ArrowRight" && nextRef?.current) {
      nextRef.current.focus();
    }

    if (e.key === "ArrowUp") {
      setActiveModul();
    }

    if (e.ctrlKey && e.key === "ArrowUp") {
      e.preventDefault();

      setValues((prev) => {
        const current = parseFloat(prev[key]) || 0;
        const next = Math.round((current + 0.25) * 100) / 100; // bezpečné zaokrouhlení
        const updated = { ...prev, [key]: String(next) };
        onChange?.(updated);
        return updated;
      });

      return;
    }
  };

  return (
    <div className={`modul ${isActive ? "active" : ""}`}>
      <input
        value={values.name}
        className={`modul-name ${isActive ? "active" : ""}`}
        type="text"
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <div className={`grid-refraction-ark ${isActive ? "active" : ""}`}>
        {/* hlavička */}
        <p className="desc-table"></p>
        <p className="desc-table">SPH</p>
        <p className="desc-table">CYL</p>
        <p className="desc-table">AX</p>

        {/* pravé oko */}
        <p className="desc">P</p>
        {/* <input
          ref={pSphRef}
          value={values.pS || ""}
          type="numeric"
          onChange={(e) => handleChange("pS", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pCylRef)}
        /> */}
        <input
          ref={pSphRef}
          value={values.pS || ""}
          type="text"
          onChange={(e) => handleChange("pS", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pCylRef, "pS")}
        />
        <input
          ref={pCylRef}
          value={values.pC || ""}
          type="text"
          onChange={(e) => handleChange("pC", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pAxRef)}
        />
        <input
          ref={pAxRef}
          value={values.pA || ""}
          type="text"
          onChange={(e) => handleChange("pA", e.target.value)}
        />

        {/* levé oko */}
        <p className="desc">L</p>
        <input
          ref={lSphRef}
          value={values.lS || ""}
          type="text"
          onChange={(e) => handleChange("lS", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, lCylRef)}
        />
        <input
          ref={lCylRef}
          value={values.lC || ""}
          type="text"
          onChange={(e) => handleChange("lC", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, lAxRef)}
        />
        <input
          ref={lAxRef}
          value={values.lA || ""}
          type="text"
          onChange={(e) => handleChange("lA", e.target.value)}
        />
      </div>
    </div>
  );
}

export default OptometryRefractionARK;
