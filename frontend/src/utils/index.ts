export function formatPercent(value: number) {
  const percent = value * 100
  return percent.toFixed(3) + '%'
}
