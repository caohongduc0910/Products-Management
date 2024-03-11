const Product = require('../../models/product.model')


// [get] /products
module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: "active",
        deleted: false

    }).sort({position: "desc"})

    const newProducts = products.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
        return item
    })

    // console.log(newProducts)

    res.render("clients/pages/products/index.pug", {
        pageTitle: 'Products',
        products: newProducts
    })
}

// [GET] /products/detail/:id
module.exports.detail = async (req, res) => {
    try {
      const find = {
        deleted: false,
        status: "active",
        slug: req.params.slug
      }
  
      const item = await Product.findOne(find)
  
      res.render("clients/pages/products/detail.pug", {
        pageTitle: item.title,
        singleItem: item
      })
    } catch (e) {
      req.flash('fail', 'Không tồn tại sản phẩm')
      res.redirect(`/products`)
    }
  }