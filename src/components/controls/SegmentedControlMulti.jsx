const SegmentedControlMulti = ({ items, selectedValues = [], onChange, width }) => {
  const handleClick = (item) => {
    const isSelected = selectedValues.includes(item);
    let newSelectedValues;
    
    if (isSelected) {
      // Odebrat položku z výběru
      newSelectedValues = selectedValues.filter(value => value !== item);
    } else {
      // Přidat položku do výběru
      newSelectedValues = [...selectedValues, item];
    }
    
    onChange(newSelectedValues);
  };

  return (
    <div className="segmented-control" style={{ width }}>
      {items.map((item) => (
        <button
          key={item}
          className={`button-controler ${
            selectedValues.includes(item) ? "active" : ""
          }`}
          onClick={() => handleClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControlMulti;
