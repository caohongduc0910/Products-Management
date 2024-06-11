const Product = require('../../models/product.model')

const newPriceHelper = require('../../helpers/new-price')

// [GET] /
module.exports.index = async (req, res) => {

    const productsFeatured = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(8)

    const newProductsFeatured = newPriceHelper.newPrice(productsFeatured)

    const products = await Product.find({
        deleted: false,
        status: "active",
    }).sort({ position: "desc" }).limit(8)

    const newProducts = newPriceHelper.newPrice(products)


    res.render("clients/pages/home/index.pug", {
        pageTitle: 'Trang chủ',
        productsFeatured: newProductsFeatured,
        products: newProducts
    })
}
