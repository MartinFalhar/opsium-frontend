import { useRef, useState, useEffect } from "react";


function OptometryIOT({
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
    
    <div className={`modul ${isActive ? "active" : ""}`}>
      <input
        value={values.name}
        className={`modul-name ${isActive ? "active" : ""}`}
        type="text"
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <div className={`grid-iot ${isActive ? "active" : ""}`}>
        {/* hlavička */}
        <p className="desc-table"></p>
        <p className="desc-table">IOT</p>
        <p className="desc-table">korekce</p>
        <p className="desc-table">CCT</p>
        <p className="desc-table">ICAN</p>
        <p className="desc-table">ICAT</p>

        {/* pravé oko */}
        <p className="desc">P</p>
        {/* <input
          ref={pSphRef}
          value={values.pS || ""}
          type="numeric"
          onChange={(e) => handleChange("pS", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pCylRef)}
        /> */}
        <input
          value={values.pIOT || ""}
          type="text"
          onChange={(e) => handleChange("pIOT", e.target.value)}

        />
        <input
          value={values.pCOR || ""}
          type="text"
          onChange={(e) => handleChange("pCOR", e.target.value)}

        />
        <input
          value={values.pCCT || ""}
          type="text"
          onChange={(e) => handleChange("pCCT", e.target.value)}
        />
        <input
          value={values.pAN || ""}
          type="text"
          onChange={(e) => handleChange("pAN", e.target.value)}
        />
        <input
          value={values.pAT || ""}
          type="text"
          onChange={(e) => handleChange("pAT", e.target.value)}
        />

        {/* levé oko */}
        <p className="desc">L</p>
        <input
          value={values.lIOT || ""}
          type="text"
          onChange={(e) => handleChange("lIOT", e.target.value)}

        />
        <input
          value={values.lCOR || ""}
          type="text"
          onChange={(e) => handleChange("lCOR", e.target.value)}

        />
        <input        
          value={values.lCCT || ""}
          type="text"
          onChange={(e) => handleChange("lCCT", e.target.value)}
        />
                <input
          value={values.lAN || ""}
          type="text"
          onChange={(e) => handleChange("lAN", e.target.value)}
        />
        <input
          value={values.lAT || ""}
          type="text"
          onChange={(e) => handleChange("lAT", e.target.value)}
        />
      </div>
    </div>
    
  );
}

export default OptometryIOT;