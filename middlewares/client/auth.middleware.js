const User = require('../../models/user.model.js')

module.exports.requireAuth = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      status: "active",
      tokenUser: req.cookies.tokenUser
    }).select('-password')
    if (user) {
      res.locals.user = user
      next()
    } else {
      res.redirect(`/user/login`)
    }
  } else {
    res.redirect(`/user/login`)
  }
}