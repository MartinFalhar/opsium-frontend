export function formatValue(value) {
  return new Intl.NumberFormat('cs-CZ', {
    signDisplay: 'always',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export default function useFormatValue() {
  return formatValue;
}
