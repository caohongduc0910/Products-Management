const User = require('../../models/user.model.js')
const Cart = require('../../models/cart.model.js')
const ForgotPassword = require('../../models/forgot-password.model.js')

const md5 = require('md5')
const sendMail = require('../../helpers/sendMail.js')

// [GET] /user/register
module.exports.register = (req, res) => {
  if (req.cookies.tokenUser) {
    res.redirect('/')
  }
  else
    res.render('clients/pages/user/register.pug', {
      pageTitle: "Đăng kí"
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {

  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
    status: "active"
  })

  if (existEmail) {
    req.flash('fail', 'Email đã tồn tại')
    res.redirect("back")
    return
  }
  else {
    req.body.password = md5(req.body.password)
    const newUser = new User(req.body)
    await newUser.save()
  }
  req.flash("success", "Đăng kí thành công")
  res.redirect('/user/login')
}

// [GET] /user/login
module.exports.login = (req, res) => {
  if (req.cookies.tokenUser) {
    res.redirect('/')
  }
  else
    res.render('clients/pages/user/login.pug', {
      pageTitle: "Đăng nhập"
    })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if (!user) {
    req.flash('fail', 'Không tồn tại người dùng')
    res.redirect("back")
    return
  }
  if (md5(password) != user.password) {
    req.flash('fail', 'Sai mật khẩu')
    res.redirect("back")
    return
  }
  if (user.status == "inactive") {
    req.flash('fail', 'Tài khoản đã bị khóa')
    res.redirect("back")
    return
  }

  await User.updateOne({
    _id: user.id
  }, {
    statusOnline: "online"
  })

  _io.once('connection', (socket) => {
    socket.broadcast.emit('SERVER_RETURN_USER_ONLINE', {
      userID: user.id
    })
  })

  res.cookie('tokenUser', user.tokenUser)
  await Cart.updateOne(
    {
      _id: req.cookies.cartid
    },
    {
      user_id: user.id
    }
  )

  req.flash("success", "Đăng nhập thành công")
  res.redirect('/')
}

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne({
    _id: res.locals.user.id
  }, {
    statusOnline: "offline"
  })

  _io.once('connection', (socket) => {
    socket.broadcast.emit('SERVER_RETURN_USER_OFFLINE', {
      userID: res.locals.user.id
    })
  })
  
  res.clearCookie("tokenUser")
  res.redirect('/user/login')
}

//[GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
  res.render('clients/pages/user/forgot-password.pug', {
    pageTitle: "Quên mật khẩu"
  })
}

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {

  const user = await User.findOne({
    email: req.body.email
  })

  if (!user) {
    req.flash('fail', "Email không tồn tại")
    res.redirect('back')
    return
  }

  //Tạo OTP, lưu vào db
  const forgotPasswordObject = {
    email: req.body.email,
    expireAt: Date.now()
  }

  const forgotPassword = new ForgotPassword(forgotPasswordObject)
  forgotPassword.save()

  //Gửi OTP qua email
  const subject = "Mã OTP của bạn"
  const text = `Mã xác minh lấy lại mật khẩu là <b>${forgotPassword.otp}</b>. Mã có hiệu lực trong vòng 3 phút. 
  Lưu ý không được để lộ mã OTP!`
  sendMail.sendMailOTP(forgotPassword.email, subject, text)

  res.redirect(`/user/password/otp?email=${req.body.email}`)
}

//[GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
  const email = req.query.email
  res.render('clients/pages/user/otp-password.pug', {
    pageTitle: "Nhập mã OTP",
    email: email
  })
}

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })

  if (!result) {
    req.flash('fail', 'OTP không hợp lệ')
    res.redirect('back')
    return
  }

  const user = await User.findOne({
    email: email
  })

  res.cookie("tokenUser", user.tokenUser)

  res.redirect('/user/password/reset')
}

//[GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
  res.render('clients/pages/user/reset-password.pug', {
    pageTitle: "Đổi mật khẩu"
  })
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  if (password != confirmPassword) {
    req.flash("fail", "Mật khẩu xác nhận không khớp")
    res.redirect('back')
    return
  }

  const tokenUser = req.cookies.tokenUser

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(req.body.password)
    }
  )
  res.redirect('/user/login')
}

//[GET] /user/info
module.exports.info = async (req, res) => {
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser
  })
  res.render('clients/pages/user/info.pug', {
    pageTitle: "Thông tin",
    user: user
  })
}
