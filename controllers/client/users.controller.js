const User = require('../../models/user.model')
const userSocket = require('../../socket/client/users.socket')

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {

  userSocket(res)

  const myID = res.locals.user.id
  const user = await User.findOne({
    _id: myID
  })
  const requestFriends = user.requestFriends
  const acceptFriends = user.acceptFriends
  const listFriends = user.friendList.map((item) => {
    return item.user_id
  })

  const users = await User.find({
    $and: [
      { _id: { $ne: myID } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: listFriends } }
    ],
    status: "active",
    deleted: false
  }).select("id avatar fullName")

  res.render('clients/pages/users/not-friend.pug', {
    pageTitle: "Danh sách người dùng",
    users: users
  })
}


// [GET] /users/request
module.exports.request = async (req, res) => {

  userSocket(res)

  const myID = res.locals.user.id
  const user = await User.findOne({
    _id: myID
  })
  const requestFriends = user.requestFriends

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false
  }).select("id avatar fullName")

  res.render('clients/pages/users/request.pug', {
    pageTitle: "Lời mời đã gửi",
    users: users
  })

}


// [GET] /users/accept
module.exports.accept = async (req, res) => {

  userSocket(res)

  const myID = res.locals.user.id
  const user = await User.findOne({
    _id: myID
  })

  const acceptFriends = user.acceptFriends

  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false
  }).select("id avatar fullName")

  res.render('clients/pages/users/accept.pug', {
    pageTitle: "Lời mời đã nhận",
    users: users
  })
}


// [GET] /users/friends
module.exports.friend = async (req, res) => {

  userSocket(res)

  const myID = res.locals.user.id
  const user = await User.findOne({
    _id: myID
  })

  const items = user.friendList
  const friendList = items.map(item => {
    return item.user_id
  })

  const users = await User.find({
    _id: { $in: friendList },
    status: "active",
    deleted: false
  }).select("id avatar fullName statusOnline")

  for (const user of users) {
    const infoUser = items.find(item => item.user_id == user.id);
    user.roomChatId = infoUser.room_chat_id;
  }

  res.render('clients/pages/users/friends.pug', {
    pageTitle: "Danh sách bạn bè",
    users: users
  })
}