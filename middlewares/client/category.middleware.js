const ProductCategory = require('../../models/products-categories.model')
const createTree = require('../../helpers/create-tree')

module.exports.category = async (req, res, next) => {
  const productCategory = await ProductCategory.find({
    deleted: false
  })
  const newProductCategory = createTree(productCategory)

  res.locals.productCategories = newProductCategory

  next()
}