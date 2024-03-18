
module.exports.validate = (req, res, next) => {
  if(!req.body.title){
    req.flash('fail', 'Vui lòng nhập tiêu đề')
    res.redirect("back")
    return
  }
  next()
}