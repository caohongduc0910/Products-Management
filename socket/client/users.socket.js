const User = require('../../models/user.model')
const RoomChat = require('../../models/room-chat.model')

module.exports = async (res) => {
  _io.once('connection', (socket) => {

    //gửi lời mời kết bạn
    socket.on('CLIENT_ADD_FRIEND', async (userID) => {
      const myUserID = res.locals.user.id
      //cho A vào acceptFriends của B
      const existUserAinB = await User.findOne({
        _id: userID,
        acceptFriends: myUserID
      })

      if (!existUserAinB) {
        await User.updateOne({
          _id: userID
        }, {
          $push: { acceptFriends: myUserID }
        })
      }

      //cho B vào requestFriends của A
      const existUserBinA = await User.findOne({
        _id: myUserID,
        requestFriends: userID
      })

      if (!existUserBinA) {
        await User.updateOne({
          _id: myUserID
        }, {
          $push: { requestFriends: userID }
        })
      }

      const infoUserB = await User.findOne({
        _id: userID
      })

      const lengthAcceptFriends = infoUserB.acceptFriends.length

      socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', {
        userID: userID,
        lengthAcceptFriends: lengthAcceptFriends
      })

      const infoUserA = await User.findOne({
        _id: myUserID
      }).select("id fullName avatar")

      socket.broadcast.emit('SERVER_RETURN_INFO_ACCEPT_FRIEND', {
        userID: userID,
        infoUserA: infoUserA
      })
    })

    //hủy gửi lời mời kết bạn
    socket.on('CLIENT_CANCEL_FRIEND', async (userID) => {
      const myUserID = res.locals.user.id
      //xóa A trong acceptFriends của B
      const existUserAinB = await User.findOne({
        _id: userID,
        acceptFriends: myUserID
      })

      if (existUserAinB) {
        await User.updateOne({
          _id: userID
        }, {
          $pull: { acceptFriends: myUserID }
        })
      }

      //xóa B trong requestFriends của A
      const existUserBinA = await User.findOne({
        _id: myUserID,
        requestFriends: userID
      })

      if (existUserBinA) {
        await User.updateOne({
          _id: myUserID
        }, {
          $pull: { requestFriends: userID }
        })
      }

      const infoUserB = await User.findOne({
        _id: userID
      })

      const lengthAcceptFriends = infoUserB.acceptFriends.length

      socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', {
        userID: userID,
        lengthAcceptFriends: lengthAcceptFriends
      })

      socket.broadcast.emit('SERVER_RETURN_USER_ID_CANCEL_FRIEND', {
        userID: userID,
        userIDA: myUserID
      })
    })

    //từ chối lời mời kết bạn
    socket.on('CLIENT_REFUSE_FRIEND', async (userID) => {
      const myUserID = res.locals.user.id
      //xóa A trong acceptFriends của B
      const existUserAinB = await User.findOne({
        _id: myUserID,
        acceptFriends: userID
      })

      if (existUserAinB) {
        await User.updateOne({
          _id: myUserID
        }, {
          $pull: { acceptFriends: userID }
        })
      }

      //xóa B trong requestFriends của A
      const existUserBinA = await User.findOne({
        _id: userID,
        requestFriends: myUserID
      })

      if (existUserBinA) {
        await User.updateOne({
          _id: userID
        }, {
          $pull: { requestFriends: myUserID }
        })
      }
    })

    //chấp nhận lời mời kết bạn
    socket.on('CLIENT_ACCEPT_FRIEND', async (userID) => {
      const myUserID = res.locals.user.id

      const existUserAinB = await User.findOne({
        _id: myUserID,
        acceptFriends: userID
      })

      const existUserBinA = await User.findOne({
        _id: userID,
        requestFriends: myUserID
      })

      let roomChat = null

      if (existUserAinB && existUserBinA) {
        roomChat = new RoomChat({
          typeRoom: "friend",
          users: [{
            user_id: userID,
            role: "superAdmin"
          }, {
            user_id: myUserID,
            role: "superAdmin"
          }],
        })

        await roomChat.save()
      }

      //xóa A trong acceptFriends của B và thêm A vào friendlist của B
      if (existUserAinB) {
        await User.updateOne({
          _id: myUserID
        }, {
          $push: {
            friendList: {
              user_id: userID,
              room_chat_id: roomChat.id
            }
          },
          $pull: { acceptFriends: userID }
        })
      }

      //xóa B trong requestFriends của A và thêm B vào friendlist của A
      if (existUserBinA) {
        await User.updateOne({
          _id: userID
        }, {
          $push: {
            friendList: {
              user_id: myUserID,
              room_chat_id: roomChat.id
            }
          },
          $pull: { requestFriends: myUserID }
        })
      }
    })
  })
}
