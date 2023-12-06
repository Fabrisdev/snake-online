export function getRandomInteger (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

export function getUniqueId (): string {
  return Math.random().toString(36).substring(2, 15)
}

export function getRandomColor () {
  const backgroundColor = [162, 214, 79]
  let red = getRandomInteger(0, 255)
  let green = getRandomInteger(0, 255)
  let blue = getRandomInteger(0, 255)
  let redDifference = Math.abs(backgroundColor[0] - red)
  let greenDifference = Math.abs(backgroundColor[1] - green)
  let blueDifference = Math.abs(backgroundColor[2] - blue)
  while (redDifference < 30 && greenDifference < 30 && blueDifference < 30) {
    red = getRandomInteger(0, 255)
    green = getRandomInteger(0, 255)
    blue = getRandomInteger(0, 255)
    redDifference = Math.abs(backgroundColor[0] - red)
    greenDifference = Math.abs(backgroundColor[1] - green)
    blueDifference = Math.abs(backgroundColor[2] - blue)
  }
  return `rgb(${red}, ${green}, ${blue})`
}
