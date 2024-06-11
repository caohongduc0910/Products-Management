
//Alert
const showAlert = document.querySelector('[show-alert]')

if (showAlert) {
  const closeBtn = document.querySelector('[close-alert]')
  const time = parseInt(showAlert.getAttribute('data-time'))

  setTimeout(() => {
    showAlert.classList.add('alert-hidden')
  }, time)

  closeBtn.onclick = () => {
    showAlert.classList.add('alert-hidden')
  }
}

//Button-back
const backBtn = document.querySelector('[button-back]')
if(backBtn) {
  backBtn.onclick = () => {
    history.back()
  }
}