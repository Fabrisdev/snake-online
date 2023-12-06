export function getRandomInteger (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

export function getUniqueId (): string {
  return Math.random().toString(36).substring(2, 15)
}

export function getRandomColor () {
  const red = getRandomInteger(0, 255)
  const green = getRandomInteger(0, 255)
  const blue = getRandomInteger(0, 255)
  return `rgb(${red}, ${green}, ${blue})`
}
