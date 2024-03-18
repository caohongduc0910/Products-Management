
const ProductCategory = require('../../models/products-categories.model')
const systemConfig = require('../../config/prefix')
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const createTree = require('../../helpers/create-tree')

// [get] /admin/dashboard
module.exports.index = async (req, res) => {

  //Filter Button
  const filterStatus = filterStatusHelper(req.query)

  let find = {
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status
  }

  //Search
  const searchObject = searchHelper(req.query)
  if (searchObject.regex) {
    find.title = searchObject.regex
  }

  //Sort
  let sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc"
  }

  const productCategory = await ProductCategory.find(find).sort(sort)

  res.render("admin/pages/products-categories/index.pug", {
    pageTitle: 'Trang danh sách danh mục',
    productCategory: productCategory,
    filterStatus: filterStatus,
    keyword: searchObject.keyword,
  })
}

// [GET] /admin/products-categories/create
module.exports.create = async (req, res) => {

  let find = {
    deleted: false
  }

  const productCategory = await ProductCategory.find(find)
  const newProductCategory = createTree(productCategory)

  res.render("admin/pages/products-categories/create.pug", {
    pageTitle: 'Tạo mới danh mục',
    newProductCategory: newProductCategory,
  })
}


// [POST] /admin/products-categories/create
module.exports.createPost = async (req, res) => {

  const count = await ProductCategory.countDocuments();

  if (req.body.position === "") {
    req.body.position = count + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  const newProductCategory = new ProductCategory(req.body)
  await newProductCategory.save()

  res.redirect(`${systemConfig.prefixAdmin}/products-categories`)

}

// [GET] /admin/products-categories/edit/:id
module.exports.edit = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const findAll = {
      deleted: false
    }

    const productCategory = await ProductCategory.find(findAll)
    const newProductCategory = createTree(productCategory)

    const item = await ProductCategory.findOne(find)

    res.render("admin/pages/products-categories/edit.pug", {
      pageTitle: 'Chỉnh sửa danh mục',
      singleItem: item,
      newProductCategory: newProductCategory,
    })
  } catch (e) {
    req.flash('fail', 'Không tồn tại danh mục')
    res.redirect(`${systemConfig.prefixAdmin}/products-categories`)
  }
}

// [PATCH] /admin/products-categories/edit/:id
module.exports.editPatch = async (req, res) => {
  console.log(req.body)
  req.body.position = parseInt(req.body.position)

  const id = req.params.id
  await ProductCategory.updateOne({ _id: id }, req.body)
  res.redirect(`${systemConfig.prefixAdmin}/products-categories`)
}

//[GET] /admin/products-categories/detail/:id
module.exports.detail = async (req, res) => {

  let find = {
    deleted: false,
    _id: req.params.id
  }

  const singleItem = await ProductCategory.findOne(find)

  console.log(singleItem)

  res.render("admin/pages/products-categories/detail.pug", {
    pageTitle: 'Chi tiết danh mục',
    singleItem: singleItem,
  })

}

// [PATCH] admin/products-categories/delete/:id
module.exports.deleteItem = async (req, res) => {

  await ProductCategory.updateOne(
    { _id: req.params.id },
    {
      deleted: true,
      deletedDate: new Date()
    })
  req.flash('success', 'Xóa danh mục thành công')
  res.redirect("back")
}



