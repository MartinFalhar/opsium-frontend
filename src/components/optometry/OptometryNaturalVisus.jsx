import { useState, useEffect, forwardRef } from "react";

const OptometryNaturalVisus = forwardRef(
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
          type="numeric"
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <div className={`grid-natural-visus ${isActive ? "active" : ""}`}>
          <p className="desc">P</p>
          <input
            ref={ref}
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
);
export default OptometryNaturalVisus;
