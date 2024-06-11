const Product = require("../../models/product.model")
const newPriceHelper = require("../../helpers/new-price")

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword
  const regex = new RegExp(keyword, "i")

  const products = await Product.find({
    status: "active",
    deleted: false,
    title: regex
  })

  const newProducts = newPriceHelper.newPrice(products)

  res.render('clients/pages/products/search.pug', {
    pageTitle: "Kết quả tìm kiếm",
    products: newProducts
  })
}