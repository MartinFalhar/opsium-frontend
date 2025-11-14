import { useState } from "react";
// import "./OptometryRefractionFull.css";

function OptometryRefractionFull({
  isActive,
  setActiveElement,
  itemValues,
  onChange,
}) {
  const [values, setValues] = useState(itemValues);

  const handleChange = (key, value) => {
    const newData = { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData); // pošle změnu zpět do rodiče
  };

  // const input1Ref = useRef(null);
  // const input2Ref = useRef(null);
  // const input3Ref = useRef(null);
  // const handleKeyDown = (e) => {
  //   if (e.key === "ArrowUp") {
  //     input2Ref.current?.focus();
  //     setActiveElement(0);
  //   }
  // };

  return (
    <div className={`modul ${isActive ? "active" : ""}`}>
      <input
        value={values.name}
        className={`modul-name ${isActive ? "active" : ""}`}
        type="numeric"
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <div className={`grid-refraction-full ${isActive ? "active" : null}`}>
        <p className="desc-table"></p>
        <p className="desc-table">SPH</p>
        <p className="desc-table">CYL</p>
        <p className="desc-table">AX</p>
        <p className="desc-table">Prizma</p>
        <p className="desc-table">Báze</p>
        <p className="desc-table">ADD</p>
        <p className="desc-table">Vizus</p>
        <p className="desc-table">BINO</p>

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
        <input
          value={values.pP}
          type="text"
          onChange={(e) => handleChange("pP", e.target.value)}
        />
        <input
          value={values.pB}
          type="text"
          onChange={(e) => handleChange("pB", e.target.value)}
        />
        <input
          value={values.pAdd}
          type="text"
          onChange={(e) => handleChange("pAdd", e.target.value)}
        />
        <input
          value={values.pV}
          type="text"
          onChange={(e) => handleChange("pV", e.target.value)}
        />
        <input
          value={values.bV}
          className="span-last"
          type="text"
          onChange={(e) => handleChange("bV", e.target.value)}
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
        <input
          value={values.lP}
          type="text"
          onChange={(e) => handleChange("lP", e.target.value)}
        />
        <input
          value={values.lB}
          type="text"
          onChange={(e) => handleChange("lB", e.target.value)}
        />
        <input
          value={values.lAdd}
          type="text"
          onChange={(e) => handleChange("lAdd", e.target.value)}
        />
        <input
          value={values.lV}
          type="text"
          onChange={(e) => handleChange("lV", e.target.value)}
        />
      </div>
    </div>
  );
}

export default OptometryRefractionFull;
