import { useState, useEffect } from "react";

function OptometryAnamnesis({
  isActive,
  activeModul,
  setActiveModul,
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

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      setActiveModul(true);
    }
  };

  return (
    <div
      className={`modul ${isActive ? "active" : ""}`}
      onKeyDown={handleKeyDown}
    >
      <input
        value={values.name}
        className={`modul-name ${isActive ? "active" : ""}`}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <textarea
        value={values.text}
        onChange={(e) => handleChange("text", e.target.value)}
      />
    </div>
  );
}

export default OptometryAnamnesis;
