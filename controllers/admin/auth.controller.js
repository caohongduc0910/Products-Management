
const md5 = require('md5')
const systemConfig = require('../../config/prefix')
const Account = require('../../models/account.model')

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  if (req.cookies) {
    const acc = await Account.findOne({
      deleted: false,
      token: req.cookies.token
    })
    if (acc) {
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }
  }
  res.render('admin/pages/auth/login.pug', {
    pageTitle: "Đăng nhập"
  })
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const username = req.body.email
  const password = req.body.password

  const user = await Account.findOne({
    deleted: false,
    email: username
  })

  if (!user) {
    req.flash('fail', 'Không tồn tại người dùng!')
    res.redirect('back')
    return
  }

  if (md5(password) != user.password) {
    req.flash('fail', 'Sai mật khẩu!')
    res.redirect('back')
    return
  }

  if (user.status == "inactive") {
    req.flash('fail', 'Tài khoản đã bị khóa!')
    res.redirect('back')
    return
  }

  res.cookie('token', user.token)
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`)

}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie('token')
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}