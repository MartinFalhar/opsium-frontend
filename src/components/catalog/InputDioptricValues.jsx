import "./InputDioptricValues.css";

function InputDioptricValues({ entryValues, onChangeEntry }) {
  
  const handleChange = (key, value) => {
    const nextEntryValues = {
      ...entryValues,
      [key]: value,
    };
    onChangeEntry(nextEntryValues);
  };

  return (
    <div className="modul-input-dioptric-values active">
      <div>
        <h1>GLASSES CORRECTION</h1>
        <div className={`grid-input-dioptric-values`}>
          <p className="desc-table"></p>
          <p className="desc-table">SPH</p>
          <p className="desc-table">CYL</p>
          <p className="desc-table">AX</p>
          <p className="desc">P</p>
          <input
            value={entryValues.pS}
            type="text"
            onChange={(e) => handleChange("pS", e.target.value)}
          />
          <input
            value={entryValues.pC}
            type="text"
            onChange={(e) => handleChange("pC", e.target.value)}
          />
          <input
            value={entryValues.pA}
            type="text"
            onChange={(e) => handleChange("pA", e.target.value)}
          />
          <p className="desc">L</p>
          <input
            value={entryValues.lS}
            type="text"
            onChange={(e) => handleChange("lS", e.target.value)}
          />
          <input
            value={entryValues.lC}
            type="text"
            onChange={(e) => handleChange("lC", e.target.value)}
          />
          <input
            value={entryValues.lA}
            type="text"
            onChange={(e) => handleChange("lA", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default InputDioptricValues;
