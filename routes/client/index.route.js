const productRouter = require('./products.route.js')
const homeRouter = require('./home.route.js')

module.exports= function(app) {
    app.use("/", homeRouter)
    app.use("/products", productRouter)
}