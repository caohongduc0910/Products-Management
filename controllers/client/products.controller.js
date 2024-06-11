const Product = require('../../models/product.model')
const ProductCategory = require('../../models/products-categories.model')

const newPriceHelper = require('../../helpers/new-price')
const getSubCategoryHelper = require('../../helpers/sub-category')

// [GET] /products
module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: "active",
        deleted: false

    }).sort({ position: "desc" })

    const newProducts = newPriceHelper.newPrice(products)

    res.render("clients/pages/products/index.pug", {
        pageTitle: 'Sản phẩm',
        products: newProducts,
    })
}

// [GET] /products/:slug
module.exports.category = async (req, res) => {

    const productCategory = await ProductCategory.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slug
    })

    const subCategory = await getSubCategoryHelper.getSubCategory(productCategory.id)
    const subCategoryID = subCategory.map(item => item.id)

    // console.log(subCategoryID)

    const products = await Product.find({
        deleted: false,
        status: "active",
        product_category_id: { $in: [productCategory.id, ...subCategoryID] }
    }).sort({ position: "desc" })

    const newProducts = newPriceHelper.newPrice(products)

    res.render('clients/pages/products/index.pug', {
        pageTitle: productCategory.title,
        products: newProducts
    })
}

// [GET] /products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const product = await Product.findOne({
            deleted: false,
            status: "active",
            slug: req.params.slug
        })

        const productCategory = await ProductCategory.findOne({
            deleted: false,
            status: "active",
            _id: product.product_category_id
        })

        if (productCategory.title) {
            product.categoryName = productCategory.title
        }

        product.newPrice = newPriceHelper.newSinglePrice(product)

        res.render("clients/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product,
            productCategory: productCategory
        })
    } catch (e) {
        req.flash('fail', 'Không tồn tại sản phẩm')
        res.redirect(`/products`)
    }
}