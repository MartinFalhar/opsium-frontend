import { useRef, useState, useEffect, forwardRef } from "react";

const OptometryNaturalVisus = forwardRef(
  ({ isActive, setActiveModul, itemValues, onChange }, ref) => {
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
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
      e.preventDefault();
      if (e.key === "ArrowUp") {
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
        onKeyDown={(e) => handleKeyDown(e)}
      >
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
