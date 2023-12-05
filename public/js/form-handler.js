import { sendDirection, Direction } from "./direction-sender.js"

const dialog = document.querySelector('dialog')
dialog.showModal()

function registerToPlay(){
  const usernameDialog = document.getElementById('username-dialog')
  const usernameInput = document.getElementById('username-input')
  if(usernameInput.value.length === 0 || usernameInput.value.length > 12) {
    const inputContainer = document.getElementById('input-container')
    inputContainer.style.backgroundColor = "#f00"
    inputContainer.style.animation = "error 500ms"
    setTimeout(() => {
      inputContainer.style.backgroundColor = "transparent"
      inputContainer.style.animation = ""
    }, 500)
    return
  }
  usernameDialog.close()
  document.addEventListener('keyup', event => {
    if(event.key === "w") sendDirection(usernameInput.value, Direction.UP)
    if(event.key === "d") sendDirection(usernameInput.value, Direction.RIGHT)
    if(event.key === "a") sendDirection(usernameInput.value, Direction.LEFT)
    if(event.key === "s") sendDirection(usernameInput.value, Direction.DOWN)
    if(event.key === "f") sendDirection(usernameInput.value, Direction.STOPPED)
  })
}

document.getElementById('username-submit').addEventListener('click', () => {
  registerToPlay()
})

document.getElementById('username-dialog').addEventListener('keyup', event => {
  if(event.key !== "Enter") return
  registerToPlay()
})