export function getRandomInteger (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

export function getUniqueId (): string {
  return Math.random().toString(36).substring(2, 15)
}

export type RGB = `rgb(${number}, ${number}, ${number})`
