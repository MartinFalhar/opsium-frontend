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

  const handleChange = (value) => {
    const newData = { ...values, note: value };
    setValues(newData);
    onChange?.(newData); // pošle změnu zpět do rodiče
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      input2Ref.current?.focus();
      setActiveElement(0);
    }
  };

  return (
    <>
      <div>
        <p>{itemValues.name}</p>
      </div>

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
