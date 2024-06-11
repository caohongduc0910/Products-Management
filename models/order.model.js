const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    card_id: String,
    status: {
      type: String,
      default: "inactive"
    },
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    productsInfo: [
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number
      }
    ]
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', orderSchema, 'orders')

module.exports = Order