import { useRef, useState, useEffect } from "react";

function OptometryNearPointAccom({
  isActive,
  setActiveElement,
  itemValues,
  onChange,
}) {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const [values, setValues] = useState(itemValues);

  useEffect(() => {
    setValues(itemValues);
  }, [itemValues]);

  const handleChange = (key, value) => {
    const newData = { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      input2Ref.current?.focus();
      setActiveElement(0);
    }
  };

  return (
    <div className={`modul ${isActive ? "active" : ""}`}>
      <input
        value={values.name}
        className={`modul-name ${isActive ? "active" : ""}`}
        type="numeric"
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <div className={`grid-near-point-accom ${isActive ? "active" : ""}`}>
        <p className="desc-table"></p>
        <p className="desc-table">BLUR</p>
        <p className="desc-table">RECOVERY</p>
        <p className="desc">P</p>
        <input
          value={values.pB}
          type="text"
          onChange={(e) => handleChange("pB", e.target.value)}
        />
        <input
          value={values.pR}
          type="text"
          onChange={(e) => handleChange("pR", e.target.value)}
        />
        <p className="desc">L</p>
        <input
          value={values.pB}
          type="text"
          onChange={(e) => handleChange("pB", e.target.value)}
        />
        <input
          value={values.lR}
          type="text"
          onChange={(e) => handleChange("lR", e.target.value)}
        />
        <p className="desc">BINO</p>
        <input
          value={values.pB}
          type="text"
          onChange={(e) => handleChange("pB", e.target.value)}
        />
        <input
          value={values.lR}
          type="text"
          onChange={(e) => handleChange("lR", e.target.value)}
        />
      </div>
    </div>
  );
}

export default OptometryNearPointAccom;
