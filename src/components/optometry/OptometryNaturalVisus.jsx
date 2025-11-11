import { useRef, useState } from "react";
import "./OptometryNaturalVisus.css";

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
    <>
      <input
        value={values.name}
        className={`modul-name ${isActive ? "active" : null}`}
        type="numeric"
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <div className={`optometry-table-natural ${isActive ? "active" : null}`}>
        <p className="desc">P</p>
        <input
          value={values.pV}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.plV}
          className="inputData span-last"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />

        <p className="desc">L</p>
        <input
          value={values.lV}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </>
  );
}

export default OptometryNaturalVisus;
