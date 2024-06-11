const Order = require('../../models/order.model')
const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')
const User = require('../../models/user.model')

const newPriceHelper = require('../../helpers/new-price')

// [GET] /checkout
module.exports.index = async (req, res) => {

  let cart = await Cart.findOne({
    _id: req.cookies.cartid
  })

  if (cart.products.length) {
    for (let product of cart.products) {
      const productDetail = await Product.findOne({
        _id: product.product_id
      })
      product.productInfo = productDetail
      product.productInfo.newPrice = newPriceHelper.newSinglePrice(productDetail)
      product.totalPrice = product.quantity * product.productInfo.newPrice
    }
  }

  cart.totalPrice = cart.products.reduce((sum, product) => {
    return sum += product.totalPrice
  }, 0)

  if(req.cookies.tokenUser){
    var user = await User.findOne({
      tokenUser: req.cookies.tokenUser
    })
  }

  if(user){
    res.render('clients/pages/checkout/index.pug', {
      pageTitle: "Đặt hàng",
      cartDetail: cart,
      user: user
    })
  }
  else{
    res.render('clients/pages/checkout/index.pug', {
      pageTitle: "Đặt hàng",
      cartDetail: cart
    })
  }
}

//[POST] /checkout/order
module.exports.order = async (req, res) => {

  const userInfo = req.body
  const products = []
  const cart = await Cart.findOne({
    _id: req.cookies.cartid
  })
  for (const product of cart.products) {
    const productObject = {}

    const productDetail = await Product.findOne({
      _id: product.product_id
    })

    productObject.product_id = product.product_id
    productObject.price = newPriceHelper.newSinglePrice(productDetail)
    productObject.discountPercentage = productDetail.discountPercentage
    productObject.quantity = product.quantity

    products.push(productObject)
  }

  const order = {
    cartID: req.cookies.cartid,
    userInfo: userInfo,
    productsInfo: products
  }

  const newOrder = new Order(order)
  await newOrder.save()
  // console.log(req.cookies.cartid)
  await Cart.updateOne({
    _id: req.cookies.cartid
  }, {
    products: []
  });

res.redirect(`/checkout/success/${newOrder.id}`)
}

// [GET] checkout/success/:orderID
module.exports.orderSuccess = async (req, res) => {
  // console.log(req.params.orderID)
  let order = await Order.findOne({
    _id: req.params.orderID
  })

  for (let product of order.productsInfo) {
    const productObject = await Product.findOne({
      _id: product.product_id
    })

    product.thumbnail = productObject.thumbnail
    product.title = productObject.title
    product.totalPrice = product.price * product.quantity
  }

  order.totalPrice = order.productsInfo.reduce((sum, item) => {
    return sum += item.totalPrice
  }, 0)

  res.render('clients/pages/checkout/orderSuccess.pug', {
    pageTitle: "Đặt hàng thành công",
    order: order
  })
}