import { useRef, useState } from "react";


function OptometryNaturalVisus({
  isActive,
  setActiveElement,
  itemValues,
  onChange,
}) {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const [values, setValues] = useState(itemValues);

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
        <div className={`grid-natural-visus ${isActive ? "active" : ""}`}>
          <p className="desc">P</p>
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
            value={values.lV}
            type="text"
            onChange={(e) => handleChange("lV", e.target.value)}
          />
        </div>
      </div>
    
  );
}

export default OptometryNaturalVisus;
