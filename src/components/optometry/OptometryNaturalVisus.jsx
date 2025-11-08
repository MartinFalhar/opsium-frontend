import { useRef } from "react";

function OptometryNaturalVisus({ isActive, setActiveElement}) {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      input2Ref.current?.focus();
      setActiveElement(0);
    }
  };

  return (
    <>
      <div className={`optometry-item-head ${isActive ? "active" : null}`}>
        <p>Naturální vizus</p>
      </div>

      <div className={`optometry-item-body ${isActive ? "active" : null}`}>
        <div className="desc">
          <h1>P</h1>
          <h1>L</h1>
        </div>

        <div className={`inputData ${isActive ? "active" : null}`}>
          <input ref={input1Ref} type="text" />
          <input ref={input2Ref} type="text" />
        </div>

        <div className={`inputData ${isActive ? "active" : null}`}>
          <input ref={input3Ref} onKeyDown={handleKeyDown} type="text" />
        </div>
      </div>

      <div className="optometry-item-footer">
        <p>Decimal/logMAR/Fraction</p>
      </div>
    </>
  );
}

export default OptometryNaturalVisus;
