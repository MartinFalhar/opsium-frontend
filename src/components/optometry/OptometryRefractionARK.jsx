import { useState, useEffect } from "react";
// import "./OptometryRefractionARKz.css";
import copyIcon from "../../styles/svg/copy.svg";

function OptometryRefractionARK({
  isActive,
  itemValues,
  onChange,
}) {
  const [values, setValues] = useState(itemValues);

  // synchronizace se změnami z rodiče
  useEffect(() => {
    setValues(itemValues);
  }, [itemValues]);

  const handleChange = (key, value) => {
    const newData = { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className={`modul ${isActive ? "active" : ""}`}>
      <input
        value={values.name}
        className={`modul-name ${isActive ? "active" : ""}`}
        type="text"
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <div className={`grid-refraction-ark ${isActive ? "active" : ""}`}>
        {/* hlavička */}
        <p className="desc-table"></p>
        <p className="desc-table">SPH</p>
        <p className="desc-table">CYL</p>
        <p className="desc-table">AX</p>

        {/* pravé oko */}
        <p className="desc">P</p>
        <input
          onFocus={handleFocus}
          value={values.pS || ""}
          type="text"
          onChange={(e) => handleChange("pS", e.target.value)}
        />
        <input
          value={values.pC || ""}
          type="text"
          onChange={(e) => handleChange("pC", e.target.value)}
        />
        <input
          value={values.pA || ""}
          type="text"
          onChange={(e) => handleChange("pA", e.target.value)}
        />

        {/* levé oko */}
        <p className="desc">L</p>
        <input
          value={values.lS || ""}
          type="text"
          onChange={(e) => handleChange("lS", e.target.value)}
        />
        <input
          value={values.lC || ""}
          type="text"
          onChange={(e) => handleChange("lC", e.target.value)}
        />
        <input
          value={values.lA || ""}
          type="text"
          onChange={(e) => handleChange("lA", e.target.value)}
        />
      </div>
    </div>
  );
}

export default OptometryRefractionARK;
