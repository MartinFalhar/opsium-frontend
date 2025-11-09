// import { useRef } from "react";
import "./OptometryRefractionFull.css";

function OptometryRefractionFull({ isActive, setActiveElement, itemValues }) 

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
        <input className={`inputData ${isActive ? "active" : null}`} type="text" />
        <input type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData span-last" type="text" />

        <p className="desc">L</p>
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        <input className="inputData" type="text" />
        {/* <input className="inputData span-last" type="text" /> */}

        {/* <p>Pozn.</p>
        <input type="text" className="inputData span-all" /> */}
      </div>

    </>
  );
}

export default OptometryRefractionFull;
