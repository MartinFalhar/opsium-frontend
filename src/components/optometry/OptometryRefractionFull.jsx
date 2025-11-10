import { useState } from "react";
import "./OptometryRefractionFull.css";

function OptometryRefractionFull({
  isActive,
  setActiveElement,
  itemValues,
  onChange,
}) {
  const [values, setValues] = useState(itemValues);

  const handleChange = (key, value) => {
    const newData = { ...values, [key]: value };
    setValues(newData);
    onChange?.(newData); // pošle změnu zpět do rodiče
  };

  // const input1Ref = useRef(null);
  // const input2Ref = useRef(null);
  // const input3Ref = useRef(null);
  // const handleKeyDown = (e) => {
  //   if (e.key === "ArrowUp") {
  //     input2Ref.current?.focus();
  //     setActiveElement(0);
  //   }
  // };

  return (
    <>
      <div>
        <p>{itemValues.name}</p>
      </div>

      <div className={`optometry-table-full ${isActive ? "active" : null}`}>
        <p className="desc-table"></p>
        <p className="desc-table">SPH</p>
        <p className="desc-table">CYL</p>
        <p className="desc-table">AX</p>
        <p className="desc-table">Prizma</p>
        <p className="desc-table">Báze</p>
        <p className="desc-table">ADD</p>
        <p className="desc-table">Vizus</p>
        <p className="desc-table">BINO</p>

        <p className="desc">P</p>
        <input
          value={values.pSph}
          className="inputData"
          type="text"
          onChange={(e) => handleChange("pSph", e.target.value)}
        />
        <input
          value={values.pCyl}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.pAx}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.pPrism}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.pBase}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.pAdd}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.pV}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.plV}
          className="inputData span-last"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />

        <p className="desc">L</p>
        <input
          value={values.lSph}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.lCyl}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
        value={values.lAx}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.lPrism}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
        value={values.lBase}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.lAdd}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
        <input
          value={values.lV}
          className="inputData"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </>
  );
}

export default OptometryRefractionFull;
