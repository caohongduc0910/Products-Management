const systemConfig = require("../../config/prefix.js")

const requireAuth = require('../../middlewares/admin/auth.middleware.js')

const dashboardRouter = require('./dashboard.route.js')
const productsRouter = require('./products.route.js')
const productsCategoriesRouter = require('./products-categories.route.js')
const rolesRouter = require('./roles.route.js')
const accountsRouter = require('./accounts.route.js')
const authRouter = require('./auth.route.js')
const myAccountRouter = require('./my-account.route.js')
const ordersRouter = require('./orders.route.js')
const settingRouter = require('./setting.route.js')


module.exports = function (app) {
  const PATH_ADMIN = systemConfig.prefixAdmin

  app.use(PATH_ADMIN + "/dashboard",
    requireAuth.requireAuth,
    dashboardRouter
  )

  app.use(PATH_ADMIN + "/products",
    requireAuth.requireAuth,
    productsRouter
  )

  app.use(PATH_ADMIN + "/products-categories",
    requireAuth.requireAuth,
    productsCategoriesRouter
  )

  app.use(PATH_ADMIN + "/orders",
    requireAuth.requireAuth,
    ordersRouter)

  app.use(PATH_ADMIN + "/roles",
    requireAuth.requireAuth,
    rolesRouter
  )

  app.use(PATH_ADMIN + "/accounts",
    requireAuth.requireAuth,
    accountsRouter
  )

  app.use(PATH_ADMIN + "/auth", authRouter)

  app.use(PATH_ADMIN + "/my-account",
    requireAuth.requireAuth,
    myAccountRouter
  )

  app.use(PATH_ADMIN + "/setting",
    requireAuth.requireAuth,
    settingRouter
  )
}