const Setting = require('../../models/setting.model.js')

module.exports.setting = async (req, res, next) => {
  const setting = await Setting.findOne({})
  if(setting){
    res.locals.setting = setting
  }
  next()
}