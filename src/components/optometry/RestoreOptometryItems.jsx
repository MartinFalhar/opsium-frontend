function restoreOptometryItems(savedData, originalItems) {
  const restored = originalItems.map((item) => {
    const key = `${item.id}-${item.modul}`;
    const savedValues = savedData[key] || {}; // uložené hodnoty pro tento modul

    const restoredValues = {};

    // Projde všechny definované položky v původním item.values
    Object.entries(item.values).forEach(([k, defaultValue]) => {
      if (savedValues[k] === undefined) {
        // Klíč není uložen → použij default
        restoredValues[k] = defaultValue;
      } else {
        // Klíč uložen → převod zpět
        const v = savedValues[k];

        if (typeof v === "number") {
          // reverze: INT × 100 → číslo
          restoredValues[k] = v / 100;
        } else {
          // text bez úprav
          restoredValues[k] = v;
        }
      }
    });

    return {
      ...item,
      values: restoredValues,
    };
  });

  return restored;
}

export default restoreOptometryItems;