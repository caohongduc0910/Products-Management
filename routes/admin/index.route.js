const dashboardRouter = require('./dashboard.route.js')
const productsRouter = require('./products.route.js')
const productsCategoriesRouter = require('./products-categories.route.js')
const rolesRouter = require('./roles.route.js')
const systemConfig = require("../../config/prefix.js")

module.exports= function(app) {
  const PATH_ADMIN = systemConfig.prefixAdmin

  app.use( PATH_ADMIN + "/dashboard", dashboardRouter)
  app.use( PATH_ADMIN + "/products", productsRouter)
  app.use( PATH_ADMIN + "/products-categories", productsCategoriesRouter)
  app.use( PATH_ADMIN + "/roles", rolesRouter)
}