import { useState } from "react";
import "./OptometryAnamnesis.css";

function OptometryAnamnesis({
  isActive,
  setActiveElement,
  itemValues,
  onChange,
}) {
  const [values, setValues] = useState(itemValues);

  const handleChange = (value) => {
    const newData = { ...values, note: value };
    setValues(newData);
    onChange?.(newData); // pošle změnu zpět do rodiče
  };

  return (
    <>
      <div className={`optometry-item-head ${isActive ? "active" : null}`}>
        <p>{itemValues.name}</p>
      </div>
      <div className="optometry-item-body">
        <textarea
          value={values.note}
          className={`optometry-item-textarea ${isActive ? "active" : null}`}
          placeholder={`isActive je  ${isActive ? "true" : "false"}`}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </>
  );
}

export default OptometryAnamnesis;
