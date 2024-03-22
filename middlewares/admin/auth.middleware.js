const systemConfig = require('../../config/prefix.js')

const Account = require('../../models/account.model.js')
const Role = require('../../models/role.model.js')

module.exports.requireAuth = async (req, res, next) => {

  if(req.cookies){

    const user = await Account.findOne({
      deleted: false,
      token: req.cookies.token
    }).select('-password')
    
    if(user) {
      const role = await Role.findOne({
        deleted: false,
        _id: user.role_id
      }).select('title permission')
      res.locals.user = user
      res.locals.role = role
      next()
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    }

  }else{
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
  }
}