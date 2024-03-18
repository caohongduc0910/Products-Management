
const Role = require('../../models/role.model')
const systemConfig = require('../../config/prefix')

// [GET] /admin/roles
module.exports.index = async (req, res) => {

  let find = {
    deleted: false
  }

  const roles = await Role.find(find)

  res.render("admin/pages/roles/index.pug", {
    pageTitle: 'Trang nhóm quyền',
    roles: roles
  })
}

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/roles/create.pug", {
    pageTitle: 'Tạo mới quyền',
  })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {

  const role = new Role(req.body)
  await role.save()

  res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {

  let find = {
    deleted: false,
    _id: req.params.id
  }

  const singleItem = await Role.findOne(find)

  res.render("admin/pages/roles/edit.pug", {
    pageTitle: 'Chỉnh sửa quyền',
    singleItem: singleItem,
  })

  // res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/editPatch/:id
module.exports.editPatch = async (req, res) => {

  try {
    await Role.updateOne({ _id: req.params.id }, req.body)
    req.flash('success', 'Cập nhật thành công')
  } catch (e) {
    req.flash('fail', 'Cập nhật thất bại')
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
  }

  res.redirect(`back`)
}

// [GET] /admin/roles/permisson
module.exports.permission = async (req, res) => {

  let find = {
    deleted: false,
  }

  const roles = await Role.find(find)

  res.render("admin/pages/roles/permission", {
    pageTitle: 'Trang phân quyền',
    roles: roles,
  })
}

// [PATCH] /admin/roles/permisson
module.exports.permissionPatch = async (req, res) => {

  const permissions = JSON.parse(req.body.permissions)

  for(permission of permissions){
    await Role.updateOne({_id: permission.id}, {permission: permission.permission})
  }

  res.redirect(`${systemConfig.prefixAdmin}/roles`)
}