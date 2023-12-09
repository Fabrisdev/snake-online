import { getRandomInteger } from './utils'

export default class Apple {
  readonly x
  readonly y
  private readonly mapSize

  constructor (mapSize: number) {
    this.mapSize = mapSize
    this.x = getRandomInteger(0, this.mapSize)
    this.y = getRandomInteger(0, this.mapSize)
  }
}
