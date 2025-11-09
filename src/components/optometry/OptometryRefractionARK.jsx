// import { useRef } from "react";
import "./OptometryRefractionARK.css";

function OptometryRefractionARK({ isActive, setActiveElement, itemValues }) 

{
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
      <div >
        <p>{itemValues.name}</p>
      </div>

      <div className={`optometry-table-ark ${isActive ? "active" : null}`}>
        <p className="desc-table"></p>
        <p className="desc-table">SPH</p>
        <p className="desc-table">CYL</p>
        <p className="desc-table">AX</p>
 

        <p className="desc">P</p>
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />


        <p className="desc">L</p>
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />

        {/* <p>Pozn.</p>
        <input type="text" className="inputData span-all" /> */}
      </div>

    </>
  );
}

export default OptometryRefractionARK;
