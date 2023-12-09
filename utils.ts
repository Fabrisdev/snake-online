import { type Position } from './player'

export function getRandomInteger (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomPosition (min: number, max: number): Position {
  return {
    x: getRandomInteger(min, max),
    y: getRandomInteger(min, max)
  }
}

export function getRandomColor () {
  const backgroundColorSaturation = rgb2hsv(162, 214, 79)[1]
  let red = getRandomInteger(0, 255)
  let green = getRandomInteger(0, 255)
  let blue = getRandomInteger(0, 255)
  let saturation = rgb2hsv(red, green, blue)[1]
  while (Math.abs(saturation - backgroundColorSaturation) > 0.1) {
    red = getRandomInteger(0, 255)
    green = getRandomInteger(0, 255)
    blue = getRandomInteger(0, 255)
    saturation = rgb2hsv(red, green, blue)[1]
  }
  return `rgb(${red}, ${green}, ${blue})`
}

function rgb2hsv (r: number, g: number, b: number) {
  const v = Math.max(r, g, b); const c = v - Math.min(r, g, b)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const h = c && ((v === r) ? (g - b) / c : ((v === g) ? 2 + (b - r) / c : 4 + (r - g) / c))
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return [60 * (h < 0 ? h + 6 : h), v && c / v, v]
}

export function getUniqueId (): string {
  return Math.random().toString(36).substring(2, 15)
}
