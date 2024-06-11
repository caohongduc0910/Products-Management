
//Xử lí nút thêm bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")

if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add('add')
      const userID = button.getAttribute('btn-add-friend')

      socket.emit('CLIENT_ADD_FRIEND', userID)
    })
  })
}

//Xử lí nút hủy khi hủy gửi kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")

if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.remove('add')
      const userID = button.getAttribute('btn-cancel-friend')

      socket.emit('CLIENT_CANCEL_FRIEND', userID)
    })
  })
}


//Xử lí nút hủy khi từ chối lời mời
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")

if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add('refuse')
      const userID = button.getAttribute('btn-refuse-friend')

      socket.emit('CLIENT_REFUSE_FRIEND', userID)
    })
  })
}


//Xử lí khi chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")

if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add('accepted')
      const userID = button.getAttribute('btn-accept-friend')

      socket.emit('CLIENT_ACCEPT_FRIEND', userID)
    })
  })
}

//Server return length of accept friend
socket.on('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', data => {

  const badgeUserAccept = document.querySelector('[badge-users-accept]')
  const userID = badgeUserAccept.getAttribute('badge-users-accept')

  if (userID == data.userID) {
    badgeUserAccept.innerHTML = data.lengthAcceptFriends
  }
})


//SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on('SERVER_RETURN_INFO_ACCEPT_FRIEND', data => {

  const dataUserAccept = document.querySelector('[data-users-accept]')
  if (dataUserAccept) {
    const userID = dataUserAccept.getAttribute('data-users-accept')

    if (userID == data.userID) {
      const newBoxUser = document.createElement('div')

      newBoxUser.classList.add('col-6')
      newBoxUser.setAttribute("user-id", data.infoUserA._id)

      newBoxUser.innerHTML = `
    <div class="box-user">
        <div class="inner-avatar">
          <img src="https://robohash.org/hicveldicta.png" alt="${data.infoUserA.fullName}" />
        </div>
        <div class="inner-info">
            <div class="inner-name">
              ${data.infoUserA.fullName}
            </div>
            <div class="inner-buttons">
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accept-friend="${data.infoUserA._id}"
              >
                Chấp nhận
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-refuse-friend="${data.infoUserA._id}"
              >
                Xóa
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-deleted-friend=""
                disabled=""
              >
                Đã xóa
              </button>
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accepted-friend=""
                disabled=""
              >
                Đã chấp nhận
              </button>
            </div>
        </div>
      </div>
  `
      dataUserAccept.appendChild(newBoxUser)
    }
  }

  else {
    const dataUserNotFriend = document.querySelector('[data-users-not-friend]')
    const userID = dataUserNotFriend.getAttribute('data-users-not-friend')

    if (userID == data.userID) {
      const boxUserRemove = dataUserNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`)
      dataUserNotFriend.removeChild(boxUserRemove)
    }
  }

  //Xử lí nút hủy khi từ chối lời mời
  const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")

  if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
      button.addEventListener('click', () => {
        button.closest('.box-user').classList.add('refuse')
        const userID = button.getAttribute('btn-refuse-friend')

        socket.emit('CLIENT_REFUSE_FRIEND', userID)
      })
    })
  }


  //Xử lí khi chấp nhận kết bạn
  const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")

  if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
      button.addEventListener('click', () => {
        button.closest('.box-user').classList.add('accepted')
        const userID = button.getAttribute('btn-accept-friend')

        socket.emit('CLIENT_ACCEPT_FRIEND', userID)
      })
    })
  }
})


//SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on('SERVER_RETURN_USER_ID_CANCEL_FRIEND', data => {

  const dataUserAccept = document.querySelector('[data-users-accept]')
  const userID = dataUserAccept.getAttribute('data-users-accept')

  if (userID == data.userID) {
    const boxUserRemove = dataUserAccept.querySelector(`[user-id="${data.userIDA}"]`)
    dataUserAccept.removeChild(boxUserRemove)
  }
})



//SERVER_RETURN_USER_ONLINE
socket.on('SERVER_RETURN_USER_ONLINE', data => {
  console.log(data)
  const dataUserFriend = document.querySelector('[data-users-friend]')
  if (dataUserFriend) {
    const boxUser = dataUserFriend.querySelector(`[user-id="${data.userID}"]`)
    console.log(boxUser)
    if(boxUser) {
      boxUser.querySelector('[status]').setAttribute("status", "online")
    }
  }
}) 


//SERVER_RETURN_USER_OFFLINE
socket.on('SERVER_RETURN_USER_OFFLINE', data => {
  const dataUserFriend = document.querySelector('[data-users-friend]')
  if (dataUserFriend) {
    const boxUser = dataUserFriend.querySelector(`[user-id="${data.userID}"]`)
    if(boxUser) {
      boxUser.querySelector('[status]').setAttribute("status", "offline")
    }
  }
}) 