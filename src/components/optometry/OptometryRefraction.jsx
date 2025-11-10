import { useState, useEffect, useRef } from "react";
import "./OptometryRefraction.css";

function OptometryRefraction({ isActive, itemValues, onChange }) {
  const [values, setValues] = useState(itemValues);

  // Refs pro horní (P) a spodní (L) řádek
  const pRefs = useRef([]);
  const lRefs = useRef([]);

  // Synchronizace se změnami z rodiče
  useEffect(() => {
    setValues(itemValues);
  }, [itemValues]);

  const handleChange = (key, value) => {
    const newData = { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData);
  };

  // Funkce pro přeskakování kurzoru
  const handleKeyDown = (e, rowRefs, index) => {
    const currentRow = rowRefs; // buď pRefs.current nebo lRefs.current
    const colCount = currentRow.length;

    if (e.key === "ArrowRight") {
      if (index + 1 < colCount) currentRow[index + 1].focus();
    } else if (e.key === "ArrowLeft") {
      if (index - 1 >= 0) currentRow[index - 1].focus();
    } else if (e.key === "ArrowDown" && currentRow === pRefs.current) {
      // z horního řádku dolů
      if (lRefs.current[index]) lRefs.current[index].focus();
    } else if (e.key === "ArrowUp" && currentRow === lRefs.current) {
      // ze spodního řádku nahoru
      if (pRefs.current[index]) pRefs.current[index].focus();
    }
  };

  return (
    <>
      <div>
        <p>{itemValues.name}</p>
      </div>

      <div className={`optometry-table ${isActive ? "active" : ""}`}>
        {/* Hlavička */}
        <p className="desc-table"></p>
        <p className="desc-table">SPH</p>
        <p className="desc-table">CYL</p>
        <p className="desc-table">AX</p>
        <p className="desc-table">ADD</p>
        <p className="desc-table">Vizus</p>
        <p className="desc-table">BINO</p>

        {/* Pravé oko P */}
        <p className="desc">P</p>
        {["pSph","pCyl","pAx","pAdd","pV","plV"].map((key, i) => (
          <input
            key={key}
            ref={el => pRefs.current[i] = el}
            value={values[key] || ""}
            type="text"
            className="inputData"
            onChange={(e) => handleChange(key, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, pRefs.current, i)}
          />
        ))}

        {/* Levé oko L */}
        <p className="desc">L</p>
        {["lSph","lCyl","lAx","lAdd","lV"].map((key, i) => (
          <input
            key={key}
            ref={el => lRefs.current[i] = el}
            value={values[key] || ""}
            type="text"
            className="inputData"
            onChange={(e) => handleChange(key, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, lRefs.current, i)}
          />
        ))}
      </div>
    </>
  );
}

export default OptometryRefraction;
