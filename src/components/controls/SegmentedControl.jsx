const SegmentedControl = ({ items, selectedValue, onClick }) => {
  return (
    <div className="segmented-control">
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
