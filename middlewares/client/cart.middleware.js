const Cart = require("../../models/cart.model")

module.exports.cartID = async (req, res, next) => {
  
  if(!req.cookies.cartid){
    const cart = new Cart()
    await cart.save()
    res.cookie("cartid", cart.id, {
      expires: new Date(Date.now() + 365*24*60*60*1000)
    })
    
    cart.productsInTotal = cart.products.length
    res.locals.cart = cart
  }  
  else{
    const cart = await Cart.findOne({
      _id: req.cookies.cartid
    })

    cart.productsInTotal = cart.products.length
    res.locals.cart = cart
  }
  
  next() 
}