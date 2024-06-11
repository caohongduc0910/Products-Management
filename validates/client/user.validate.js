module.exports.validate = (req, res, next) => {

  if(!req.body.fullName){
    req.flash('fail', 'Vui lòng nhập tên đăng nhập')
    res.redirect("back")
    return
  }

  if(!req.body.email){
    req.flash('fail', 'Vui lòng nhập email')
    res.redirect("back")
    return
  }

  if(!req.body.password){
    req.flash('fail', 'Vui lòng nhập mật khẩu')
    res.redirect("back")
    return
  }
  next()
}

module.exports.validateForgotPassword = (req, res, next) => {
  if(!req.body.email){
    req.flash('fail', 'Vui lòng nhập email')
    res.redirect("back")
    return
  }
  next()
}

module.exports.validateResetPassword = (req, res, next) => {
  if(!req.body.password){
    req.flash('fail', 'Mật khẩu không được để trống')
    res.redirect('back')
    return
  }

  if(!req.body.confirmPassword){
    req.flash('fail', 'Vui lòng xác nhận lại mật khẩu')
    res.redirect('back')
    return
  }
  next()
}