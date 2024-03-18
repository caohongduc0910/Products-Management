const Product = require("../../models/product.model.js")
const ProductCategory = require("../../models/products-categories.model.js")

const systemConfig = require("../../config/prefix.js")

const filterStatusHelper = require("../../helpers/filterStatus.js")
const searchHelper = require("../../helpers/search.js")
const paginationHelper = require("../../helpers/pagination.js")
const createTree = require("../../helpers/create-tree.js")

// [GET] /admin/products

module.exports.index = async (req, res) => {

  const filterStatus = filterStatusHelper(req.query)  //Filter

  //Database filter
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

  //Pagination
  const count = await Product.countDocuments(find)
  const objectPagination = paginationHelper(req.query, count)

  //Sort
  let sort = {}
  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  }else {
    sort.position = "desc"
  }

  //Render data
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.startItem) 

  res.render("admin/pages/products/index.pug", {
    pageTitle: 'Danh sách sản phẩm',
    products: products,
    filterStatus: filterStatus,
    keyword: searchObject.keyword,
    objectPagination: objectPagination,
  })

}

// [PATCH] admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
  const id = req.params.id
  const status = req.params.status

  req.flash('success', 'Cập nhật trạng thái thành công');

  await Product.updateOne({ _id: id }, { status: status })

  res.redirect("back")
}

// [PATCH] admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
  // console.log(req.body)
  const type = req.body.type
  const ids = req.body.ids.split(", ")

  if (type == "active") {
    await Product.updateMany({ _id: { $in: ids } }, {
      status: "active"
    })
    req.flash('success', 'Cập nhật trạng thái thành công');


  }
  else if (type == "inactive") {
    await Product.updateMany({ _id: { $in: ids } }, {
      status: "inactive"
    })
    req.flash('success', 'Cập nhật trạng thái thành công');

  }
  else if (type == "delete-all") {
    await Product.updateMany({ _id: { $in: ids } }, {
      deleted: true,
      deletedAt: new Date()
    })
    req.flash('success', 'Xóa sản phẩm thành công');

  }
  else {

    for (const id of ids) {
      let [idItem, position] = id.split(" - ")
      position = parseInt(position)
      await Product.updateOne({ _id: idItem }, {
        position: position
      })
    }
  }

  res.redirect("back")
}

// [PATCH] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  console.log(req.params)

  // await Product.deleteOne({_id: id})
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedDate: new Date()
    })
  req.flash('success', 'Xóa sản phẩm thành công')
  res.redirect("back")
}

// [GET] /admin/products/create
module.exports.createGet = async (req, res) => {

  let find = {
    deleted: false
  }

  const productCategory = await ProductCategory.find(find)
  const newProductCategory = createTree(productCategory)

  res.render("admin/pages/products/create.pug", {
    pageTitle: 'Tạo mới sản phẩm',
    newProductCategory: newProductCategory
  })
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {

  console.log(req.body)

  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)

  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`
  // }

  const count = await Product.countDocuments();

  if (req.body.position === "") {
    req.body.position = count + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  const newProduct = new Product(req.body)
  await newProduct.save()

  // console.log(req.file)

  res.redirect(`${systemConfig.prefixAdmin}/products`)

}

// [GET] /admin/products/edit/:id
module.exports.editItem = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const findAll = {
      deleted: false,
    }

    const item = await Product.findOne(find)
    const productCategory = await ProductCategory.find(findAll)
    const newProductCategory = createTree(productCategory)

    res.render("admin/pages/products/edit.pug", {
      pageTitle: 'Chỉnh sửa sản phẩm',
      singleItem: item,
      newProductCategory: newProductCategory
    })
  } catch (e) {
    req.flash('fail', 'Không tồn tại sản phẩm')
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editItemPatch = async (req, res) => {

  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  req.body.position = parseInt(req.body.position)

  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`
  // }

  const id = req.params.id
  try {
    await Product.updateOne({ _id: id }, req.body)
    req.flash('success', 'Cập nhật thành công')
  } catch (e) {
    req.flash('fail', 'Cập nhật thất bại')
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }

  res.redirect('back')
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const item = await Product.findOne(find)

    res.render("admin/pages/products/detail.pug", {
      pageTitle: item.title,
      singleItem: item
    })
  } catch (e) {
    req.flash('fail', 'Không tồn tại sản phẩm')
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}