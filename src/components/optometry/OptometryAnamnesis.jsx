import { useState, useEffect, forwardRef } from "react";

const OptometryAnamnesis = forwardRef(
  ({ isActive, activeModul, setActiveModul, itemValues, onChange }, ref) => {
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
        e.preventDefault();
        setActiveModul(true);

        const parentArea = e.target.closest(".optometry-area");
        if (parentArea) {
          parentArea.focus();
        }
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
          ref={ref}
          value={values.text}
          onChange={(e) => handleChange("text", e.target.value)}
        />
      </div>
    );
  }
);

export default OptometryAnamnesis;
