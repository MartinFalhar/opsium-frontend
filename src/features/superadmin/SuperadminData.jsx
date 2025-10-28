import React from "react";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

function SuperadminData() {
  return (
    <div className="sweet-loading">
      <h2>Puff Loader Example</h2>
      <PuffLoaderSpinner active={true} />
    </div>
  );
}

export default SuperadminData;
