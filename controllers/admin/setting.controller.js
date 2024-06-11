const Setting = require('../../models/setting.model')

// [GET] /setting/general
module.exports.general = async (req, res) => {
  const setting = await Setting.findOne({})
  if (!setting) {
    res.render('admin/pages/settings/general.pug', {
      pageTitle: "Cài đặt"
    })
  }
  else{
    res.render('admin/pages/settings/general.pug', {
      pageTitle: "Cài đặt",
      setting: setting
    })
  }
}

// [PATCH] /setting/general
module.exports.generalPatch = async (req, res) => {
  const setting = await Setting.findOne({})
  if (setting) {
    await Setting.updateOne({_id: setting.id}, req.body)
  }
  else {
    const newSetting = new Setting(req.body)
    await newSetting.save()
  }
  req.flash('success', 'Cập nhật thành công')
  res.redirect('back')
}