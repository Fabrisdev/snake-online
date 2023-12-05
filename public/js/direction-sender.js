import { socket } from "./connection-setup.js"

export const Direction = {
  RIGHT: "right",
  LEFT: "left",
  UP: "up",
  DOWN: "down",
}

export function sendDirection(name, direction){
  socket.send(JSON.stringify({
    name,
    direction
  }))
}