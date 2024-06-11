const RoomChat = require('../../models/room-chat.model')

module.exports.isAccess = async (req, res, next) => {
  const userID = res.locals.user.id
  const roomID = req.params.roomChatID

  const isAccessRoomChat = await RoomChat.findOne({
    _id: roomID,
    "users.user_id": userID,
    deleted: false
  })

  if (isAccessRoomChat) {
    next()
  }
  else {
    res.redirect('/')
  }
}