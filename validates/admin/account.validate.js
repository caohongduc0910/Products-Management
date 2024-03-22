
module.exports.createPost = (req, res, next) => {

  if(!req.body.fullName){
    req.flash('fail', 'Vui lòng nhập tên')
    res.redirect("back")
    return
  }

  if(!req.body.password){
    req.flash('fail', 'Vui lòng nhập mật khẩu')
    res.redirect("back")
    return
  }

  if(!req.body.email){
    req.flash('fail', 'Vui lòng nhập email')
    res.redirect("back")
    return
  }
  next()
}

module.exports.editPath = (req, res, next) => {

  if(!req.body.fullName){
    req.flash('fail', 'Vui lòng nhập tên')
    res.redirect("back")
    return
  }

  if(!req.body.email){
    req.flash('fail', 'Vui lòng nhập email')
    res.redirect("back")
    return
  }
  next()
}