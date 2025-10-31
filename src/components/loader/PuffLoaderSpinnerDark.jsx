import React from "react";
import { PuffLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function PuffLoaderSpinnerDark({ active }) {
  if (!active) return null;
  return (
    <div className="sweet-loading">
      <PuffLoader
        color={"var(--color-bg-b1)"}
        loading={active}
        cssOverride={override}
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default PuffLoaderSpinnerDark;
