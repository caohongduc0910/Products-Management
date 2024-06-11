import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//file upload with review
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
  multiple: true,
  maxFileCount: 6
});

//Chat
const formSent = document.querySelector('.chat .inner-form')
if (formSent) {
  formSent.addEventListener('submit', (e) => {
    e.preventDefault()
    const content = e.target.elements.content.value
    const images = upload.cachedFileArray || [] 

    if (content || images.length > 0) {
      socket.emit('CLIENT_SEND_MESSAGE', {
        content: content,
        images: images
      })
      e.target.elements.content.value = ""
      upload.resetPreviewPanel()
      socket.emit("CLIENT_SEND_TYPING", 'hide')
    }
  })
}

socket.on("SERVER_RETURN_MESSAGE", (data) => {

  const body = document.querySelector('.inner-body')
  const id = document.querySelector('[my-id]').getAttribute('my-id')
  const boxTyping = document.querySelector(".inner-list-typing")

  const div = document.createElement('div')

  let htmlFullname = "";
  let htmlContent = "";
  let htmlImg = "";

  if (id == data.userID) {
    div.classList.add('inner-outgoing')
  } else {
    div.classList.add('inner-incoming')
    htmlFullname = `
      <div class="inner-name">${data.userName}</div>
    `
  }
  
  if(data.content) {
    htmlContent = `
      <div class="inner-content">${data.content}</div>
    `
  }

  if(data.images) {
    htmlImg  = `<div class="inner-images">`
    for(const img of data.images) {
      htmlImg += `
      <img src=${img}>
    `
    }
    htmlImg += `</div>`
  }

  div.innerHTML = `
    ${htmlFullname}
    ${htmlContent}
    ${htmlImg}
  `

  body.insertBefore(div, boxTyping)
  body.scrollTop = body.scrollHeight

  const newImgList = div.querySelector('.inner-images')
  if(newImgList) {
    const gallery = new Viewer(newImgList)
  }
})

//Scroll chat to bottom
const body = document.querySelector('.inner-body')
body.scrollTop = body.scrollHeight

var timeout
const showTyping = () => {
  socket.emit('CLIENT_SEND_TYPING', 'show')

  clearTimeout(timeout)

  timeout = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", 'hide')
  }, 3000)
}

//Emoji
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip)
  //toggle icon board
  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
  }

  const input = document.querySelector(".inner-form input[name='content']")
  const emojiBoard = document.querySelector('emoji-picker')

  if (emojiBoard) {
    emojiBoard.addEventListener('emoji-click', (e) => {
      input.value = input.value + e.detail.unicode

      const end = input.value.length
      input.SelectionRange(end, end)
      input.focus()
    })

    showTyping()
  }

  input.addEventListener('keyup', () => {
    showTyping()
  })
}

//SERVER_RETURN_TYPING
const listTyping = document.querySelector('.inner-list-typing')
if (listTyping) {
  socket.on('SERVER_RETURN_TYPING', (data) => {
    if (data.type == "show") {
      const existBoxTyping = document.querySelector(`[user-id="${data.userID}"]`)
      console.log(existBoxTyping)
      if (!existBoxTyping) {
        const boxTyping = document.createElement('div')
        boxTyping.classList.add('box-typing')
        boxTyping.setAttribute('user-id', data.userID)
        boxTyping.innerHTML = `
      <div class="inner-name">${data.userName} </div>
      <div class="inner-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
     `
        listTyping.appendChild(boxTyping)
        body.scrollTop = body.scrollHeight
      }
    }
    else {
      const existBoxTyping = document.querySelector(`[user-id="${data.userID}"]`)
      if (existBoxTyping) {
        listTyping.removeChild(existBoxTyping)
      }
    }
  })
}

const imgList = document.querySelector('.chat .inner-body')
if(imgList) {
  const gallery = new Viewer(imgList)
}



