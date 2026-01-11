const SegmentedControl = ({ items, selectedValue, onClick, width }) => {
  return (
    <div className="segmented-control" style={{ width }}>
      {items.map((item) => (
        <button
          key={item}
          className={`button-controler ${
            item === selectedValue ? "active" : ""
          }`}
          onClick={() => onClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
