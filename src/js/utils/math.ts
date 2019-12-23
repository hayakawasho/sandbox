
export const norm = (val: number, min: number, max: number) => {
  if (val < min) return 0
  if (val > max) return 1

  return val === max ? 1 : (val - min) / (max - min)
}

export const lerp = (a: number, b: number, n: number) => {
  return (1 - n) * a + n * b
}

export const map = (value: number, min1: number, max1: number, min2: number, max2: number) => {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1))
}

export const hypot = (n: number, m: number) => {
  return Math.sqrt(n * n + m * m)
}

export const deg2rad = (n: number) => {
  return (n * Math.PI) / 180
}

export const rad2deg = (n: number) => {
  return (180 * n) / Math.PI
}

export const lineEq = (y2: number, y1: number, x2: number, x1: number, currentVal: number) => {
  const m = (y2 - y1) / (x2 - x1)
  const b = y1 - m * x1

  return m * currentVal + b;
}
