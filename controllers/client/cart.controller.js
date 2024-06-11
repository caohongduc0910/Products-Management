const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")

const newPriceHelper = require('../../helpers/new-price')

// [GET] /cart
module.exports.index = async (req, res) => {
  let cart = await Cart.findOne({
    _id: req.cookies.cartid
  })

  if(cart.products.length){
    for(let product of cart.products){
      let productInfo = await Product.findOne({
        _id: product.product_id
      })
      productInfo.newPrice = newPriceHelper.newSinglePrice(productInfo)
      product.totalPrice = productInfo.newPrice * product.quantity
      product.productInfo = productInfo
    }
  }

  cart.totalPrice = cart.products.reduce((sum, product) => {
    return sum += product.totalPrice
  }, 0)

  res.render('clients/pages/cart.pug',{
    pageTitle: "Trang giỏ hàng",
    cartDetail: cart
  })
}

// [POST] /cart/add/:id
module.exports.cartPost = async (req, res) => {

  const cartID = req.cookies.cartid
  const productID = req.params.id
  const quantity = parseInt(req.body.quantity)

  const cart = await Cart.findOne({
    _id: cartID
  })

  const existProduct = cart.products.find(function (item) {
    return item.product_id == productID
  })

  if (existProduct) {
    const newQuantity = quantity + existProduct.quantity
    await Cart.updateOne(
      {
        _id: cartID,
        'products.product_id': existProduct.product_id
      },
      {
        $set: {
          'products.$.quantity': newQuantity
        }
      }
    )
  } else {
    await Cart.updateOne(
      {
        _id: cartID
      },
      {
        $push: {
          products: {
            product_id: productID,
            quantity: quantity
          }
        }
      }
    )
  }
  req.flash('success', 'Thêm sản phẩm vào giỏ hàng thành công')
  res.redirect('back')
}

// [GET] /cart/delete/:id
module.exports.delete = async (req, res) => {
  const productID = req.params.id
  await Cart.updateOne({
    _id: req.cookies.cartid
  },
  {
    "$pull":{
      products: {"product_id": productID}
    }
  })

  req.flash('success', 'Xóa sản phẩm thành công')
  res.redirect('back')
}

// [GET] /cart/update/:productID/:quantity
module.exports.update = async (req, res) => {
  const productID = req.params.productID
  const quantity = req.params.quantity
  await Cart.updateOne({
    _id: req.cookies.cartid,
    'products.product_id': productID
  },
  {
    $set: {
      'products.$.quantity': quantity
    }
  })

  req.flash('success', 'Cập nhật số lượng sản phẩm thành công')
  res.redirect('back')
}