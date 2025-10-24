import { useState } from "react";

function ClientOptometry() {
  const [sph, setSph] = useState("");

  return (
    <div className="container">
      <div className="info-box">
        <h1>CLIENT OPTOMETRY - external module</h1>
      </div>

      <div className="info-box">
        <label htmlFor="sph">SPH</label>
        <input
          type="text"
          value={sph}
          onChange={(e) => setSph(e.target.value)}
          placeholder="SPH"
        />
      </div>
      <button type="submit">Uložit</button>
    </div>
  );
}

export default ClientOptometry;
