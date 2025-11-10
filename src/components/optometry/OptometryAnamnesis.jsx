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
      <div
        className={`optometry-table-anamnesis ${isActive ? "active" : null}`}
      >
        <p>{itemValues.name}</p>
        <textarea
          value={values.note}
          className="input-textarea"
          placeholder={`Zde zadejte text...`}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </>
  );
}

export default OptometryAnamnesis;
