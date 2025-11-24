import { useState, useEffect } from "react";

function OptometryAnamnesis({
  isActive,
  setActiveElement,
  itemValues,
  onChange,
}) {
  const [values, setValues] = useState(itemValues);

  useEffect(() => {
    setValues(itemValues);
  }, [itemValues]);

  const handleChange = (key, value) => {
    const newData = { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData);
  };

  return (
    <>
      <div className={`modul ${isActive ? "active" : ""}`}>
        <input
          value={values.name}
          className={`modul-name ${isActive ? "active" : ""}`}
          type="numeric"
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <textarea
          value={values.text}
          placeholder={`Zde zadejte text...`}
          onChange={(e) => handleChange("text", e.target.value)}
        />
      </div>
    </>
  );
}

export default OptometryAnamnesis;
