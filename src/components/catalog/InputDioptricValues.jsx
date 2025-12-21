import { useState, useEffect } from "react";
import "./InputDioptricValues.css";

function InputDioptricValues({ itemValues }) {
  const [values, setValues] = useState(itemValues);

  //PROPS poslané z rodiče, změny posílá zpět rodiči
  useEffect(() => {
    setValues(itemValues);
  }, [itemValues]);

  //zachtycení změn v jednotlivých polích - globální handler
  const handleChange = (key, value) => {
    const newData = { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData); // pošle změnu zpět do rodiče
  };

  return (
    <div
      className="modul-input-dioptric-values active"
    >
      <div className={`grid-input-dioptric-values`}>
        
        <p className="desc-table"></p>
        <p className="desc-table">SPH</p>
        <p className="desc-table">CYL</p>
        <p className="desc-table">AX</p>
        <p className="desc">P</p>
        <input
          value={values.pS}
          type="text"
          onChange={(e) => handleChange("pS", e.target.value)}
        />
        <input
          value={values.pC}
          type="text"
          onChange={(e) => handleChange("pC", e.target.value)}
        />
        <input
          value={values.pA}
          type="text"
          onChange={(e) => handleChange("pA", e.target.value)}
        />

        <p className="desc">L</p>
        <input
          value={values.lS}
          type="text"
          onChange={(e) => handleChange("lS", e.target.value)}
        />
        <input
          value={values.lC}
          type="text"
          onChange={(e) => handleChange("lC", e.target.value)}
        />
        <input
          value={values.lA}
          type="text"
          onChange={(e) => handleChange("lA", e.target.value)}
        />
      </div>
      <h1>VERTEX DISTANCE</h1>
      <h1>CONTACT LENS CORRECTION</h1>
    </div>
  );
}

export default InputDioptricValues;
