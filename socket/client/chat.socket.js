const Chat = require('../../models/chat.model')
const uploadToCloudinary = require('../../helpers/uploadCloudinary')

module.exports = async (req, res) => {
  _io.once('connection', (socket) => {
    
    const roomID = req.params.roomChatID
    socket.join(roomID)

    socket.on('CLIENT_SEND_MESSAGE', async (data) => {

      const images = []

      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary.uploadToCloudinary(imageBuffer)
        images.push(link)
      }

      const chat = new Chat({
        user_id: res.locals.user.id,
        content: data.content,
        images: images,
        room_chat_id: roomID
      })
      await chat.save()

      _io.to(roomID).emit('SERVER_RETURN_MESSAGE', {
        userID: res.locals.user.id,
        userName: res.locals.user.fullName,
        content: data.content,
        images: images
      })
    })

    socket.on('CLIENT_SEND_TYPING', (data) => {
      socket.broadcast.to(roomID).emit('SERVER_RETURN_TYPING', {
        userID: res.locals.user.id,
        userName: res.locals.user.fullName,
        type: data
      })
    })
  })
}
