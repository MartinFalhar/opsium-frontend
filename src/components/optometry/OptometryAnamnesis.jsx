import { useState, useEffect, forwardRef } from "react";

const OptometryAnamnesis = forwardRef(
  ({ isActive, itemValues, onChange }, ref) => {
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
      <div className={`modul ${isActive ? "active" : ""}`}>
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
