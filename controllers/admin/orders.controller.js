const Order = require('../../models/order.model')
const Product = require('../../models/product.model')

//[GET] /admin/orders
module.exports.index = async (req, res) => {
  const orders = await Order.find()
  res.render('admin/pages/orders/index.pug', {
    pageTitle: "Đơn hàng",
    orders: orders
  })
}

//[GET] //admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  let singleOrder = await Order.findOne({
    _id: req.params.id
  })

  for(let productInfo of singleOrder.productsInfo){
    const product = await Product.findOne({
      _id: productInfo.product_id
    })
    productInfo.thumbnail = product.thumbnail,
    productInfo.title = product.title
    productInfo.totalPrice = productInfo.quantity * productInfo.price
  }

  singleOrder.totalPrice = singleOrder.productsInfo.reduce((sum, item) => {
    return sum += item.price
  }, 0)

  res.render('admin/pages/orders/detail.pug', {
    pageTitle: "Chi tiết",
    order: singleOrder
  })
}

//[DELETE] /admin/orders/delete/:id
module.exports.delete = async (req, res) => {
  await Order.deleteOne({_id: req.params.id})
  res.redirect('back')
}

//[PATCH] admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id
  const status = req.params.status
  await Order.updateOne(
    {
      _id: id
    },
    {
      status: status
    }
  )
  res.redirect('back')
}
