import { useState, useEffect, useRef } from "react";
import "./OptometryRefractionARK.css";

function OptometryRefractionARK({ isActive, setActiveElement, itemValues, onChange }) {
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
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "ArrowRight" && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  return (
    <>
      <div>
        <p>{itemValues.name}</p>
      </div>

      <div className={`optometry-table-ark ${isActive ? "active" : ""}`}>
        {/* hlavička */}
        <p className="desc-table"></p>
        <p className="desc-table">SPH</p>
        <p className="desc-table">CYL</p>
        <p className="desc-table">AX</p>

        {/* pravé oko */}
        <p className="desc">P</p>
        <input
          ref={pSphRef}
          value={values.pSph || ""}
          className="inputData"
          type="text"
          onChange={(e) => handleChange("pSph", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pCylRef)}
        />
        <input
          ref={pCylRef}
          value={values.pCyl || ""}
          className="inputData"
          type="text"
          onChange={(e) => handleChange("pCyl", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pAxRef)}
        />
        <input
          ref={pAxRef}
          value={values.pAx || ""}
          className="inputData"
          type="text"
          onChange={(e) => handleChange("pAx", e.target.value)}
        />

        {/* levé oko */}
        <p className="desc">L</p>
        <input
          ref={lSphRef}
          value={values.lSph || ""}
          className="inputData"
          type="text"
          onChange={(e) => handleChange("lSph", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, lCylRef)}
        />
        <input
          ref={lCylRef}
          value={values.lCyl || ""}
          className="inputData"
          type="text"
          onChange={(e) => handleChange("lCyl", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, lAxRef)}
        />
        <input
          ref={lAxRef}
          value={values.lAx || ""}
          className="inputData"
          type="text"
          onChange={(e) => handleChange("lAx", e.target.value)}
        />
      </div>
    </>
  );
}

export default OptometryRefractionARK;
