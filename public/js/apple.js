import Square from "./square.js"

export default class Apple extends Square {
  constructor({
    ctx, position, size
  }) {
    super({
      ctx, 
      position, 
      size, 
      color: '#f00'
    })
  }
}