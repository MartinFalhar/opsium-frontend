import "./OptometryItems.css";

function OptometryAnamnesis({isActive}) {
  return (
    <>
      <div className={`optometry-item-head ${isActive ? "active" : null}`}>
        <p>Anamnéza</p>
      </div>
      <div className="optometry-item-body">
        <textarea
          className={`optometry-item-textarea ${isActive ? "active" : null}`}
          placeholder={`isActive je  ${isActive ? "true" : "false"}`}
        />
      </div>
    </>
  );
}

export default OptometryAnamnesis;
