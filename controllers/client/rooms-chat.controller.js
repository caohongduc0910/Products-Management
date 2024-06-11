const RoomChat = require('../../models/room-chat.model')
const User = require('../../models/user.model')
const chatSocket = require('../../socket/client/chat.socket.js')

//[GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userID = res.locals.user.id

  const listRoomChat = await RoomChat.find({
    typeRoom: "group",
    "users.user_id": userID,
    deleted: false
  })

  res.render('clients/pages/rooms-chat/index.pug', {
    pageTitle: "Chat",
    listRoomChat: listRoomChat
  })
}

//[GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendList

  for(let friend of friendsList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id
    }).select('fullName avatar')

    friend.infoFriend = infoFriend
  }

  res.render('clients/pages/rooms-chat/create.pug', {
    pageTitle: "Tạo phòng",
    friendsList: friendsList
  })
}


//[POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title
  const usersID = req.body.usersID

  const dataChat = {
    title: title,
    typeRoom: "group",
    users: []
  }

  usersID.forEach(userID => {
    dataChat.users.push({
      user_id: userID,
      role: "user"  
    })
  })

  dataChat.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin"  
  })

  const room = new RoomChat(dataChat)
  await room.save()
 
  res.redirect(`/chat/${room.id}`)
}
