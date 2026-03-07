import { useState, useEffect } from "react";

function OptometryNearPointConv({
  isActive,
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
    <div className={`modul ${isActive ? "active" : ""}`}>
      <input
        value={values.name}
        className={`modul-name ${isActive ? "active" : ""}`}
        type="numeric"
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <div className={`grid-near-point-conv ${isActive ? "active" : ""}`}>
        <p className="desc-table">BLUR</p>
        <p className="desc-table">RECOVERY</p>
        <input
          value={values.b}
          type="text"
          onChange={(e) => handleChange("b", e.target.value)}
        />
        <input
          value={values.r}
          type="text"
          onChange={(e) => handleChange("r", e.target.value)}
        />


      </div>
    </div>
  );
}

export default OptometryNearPointConv;
