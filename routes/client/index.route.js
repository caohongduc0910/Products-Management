const productRouter = require('./products.route.js')
const homeRouter = require('./home.route.js')

const categoryMiddleware = require('../../middlewares/client/category.middleware.js')

module.exports= function(app) {

    app.use(categoryMiddleware.category)

    app.use("/", homeRouter)
    
    app.use("/products", productRouter)
}