
const Role = require('../../models/role.model')
const systemConfig = require('../../config/prefix')

// [GET] /admin/roles
module.exports.index = async (req, res) => {

  const roles = await Role.find({
    deleted: false
  })

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
  if(res.locals.role.permission.includes("roles_permissions")){
    let find = {
      deleted: false,
    }
  
    const roles = await Role.find(find)
  
    res.render("admin/pages/roles/permission", {
      pageTitle: 'Trang phân quyền',
      roles: roles,
    })
  }
  else{
    res.redirect(`${systemConfig.prefixAdmin}/roles`) 
  }
}

// [PATCH] /admin/roles/permisson
module.exports.permissionPatch = async (req, res) => {
  
  if(res.locals.role.permission.includes("roles-permissions")){
    try {
      const permissions = JSON.parse(req.body.permissions)
      for (let permission of permissions) {
        await Role.updateOne({ _id: permission.id }, { permission: permission.permission })
      }
    } catch(e) {
      req.flash('fail', 'Cập nhật không thành công')
      res.redirect('back')
    }
    req.flash('success', 'Cập nhật thành công')
    res.redirect(`back`)
  }
  else{
    res.send("Không có quyền thực hiện hành đông!")
  }
}

// [GET] /admin/roles/detail
module.exports.detail = async (req, res) => {

    const role = await Role.findOne({
      deleted: false,
      _id: req.params.id
    })

    res.render('admin/pages/roles/detail', {
      pageTitle: "Chi tiết quyền",
      singleItem: role
    })
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {

  const id = req.params.id

  let deletedBy = {
    account_id: id,
    deletedAt: new Date()
  }

  await Role.updateOne({_id: id}, {
    deleted: true,
    $push: { deletedBy: deletedBy }
  })

  res.redirect(`back`)
} 