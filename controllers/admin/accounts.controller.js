
const Account = require('../../models/account.model')
const Role = require('../../models/role.model')
const systemConfig = require('../../config/prefix')
const md5 = require('md5')

// [GET] /admin/accounts
module.exports.index = async (req, res) => {

  let accounts = await Account.find({
    deleted: false
  }).select("-password -token")

  for (let account of accounts) {
    const role = await Role.findOne({
      deleted: false,
      _id: account.role_id
    })
    account.role_name = role.title
  }

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: 'Trang danh sách tài khoản',
    accounts: accounts,
  })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {

  const roles = await Role.find({
    deleted: false
  })

  res.render('admin/pages/accounts/create.pug', {
    pageTitle: "Tạo mới tài khoản",
    roles: roles
  })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {

  const existEmail = await Account.findOne({
    deleted: false,
    email: req.body.email
  })

  if (existEmail) {
    req.flash('fail', `Email ${req.body.email} đã tồn tại!!!`)
    res.redirect('back')
  }
  else {
    req.body.password = md5(req.body.password)
    const acc = new Account(req.body)
    await acc.save()
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {

  const account = await Account.findOne({
    deleted: false,
    _id: req.params.id
  })

  account.password = md5(account.password)

  const roles = await Role.find({
    deleted: false,
  })

  res.render('admin/pages/accounts/edit.pug', {
    pageTitle: "Cập nhật tài khoản",
    account: account,
    roles: roles
  })
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {

  const emailExist = await Account.findOne({
    _id: { $ne: req.params.id },
    deleted: false,
    email: req.body.email
  })

  if (emailExist) {
    req.flash('fail', `Email ${req.body.email} đã tồn tại!!!`)
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password)
    } else {
      delete req.body.password
    }
    await Account.updateOne({ _id: req.params.id }, req.body)
    req.flash('success', 'Cập nhật thành công')
  }
  res.redirect(`back`)
}