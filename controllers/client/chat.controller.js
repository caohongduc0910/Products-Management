const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')
const chatSocket = require('../../socket/client/chat.socket.js')

//[GET] /chat/:roomChatID
module.exports.index = async (req, res) => {

  chatSocket(req, res)

  const chats = await Chat.find({
    room_chat_id: req.params.roomChatID,
    deleted: false
  })

  for (const chat of chats) {
    const user = await User.findOne({
      _id: chat.user_id
    })
    chat.user_name = user.fullName
  }

  res.render('clients/pages/chat/index.pug', {
    pageTitle: "Chat",
    chats: chats
  })
}