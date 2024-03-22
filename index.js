
const express = require('express')
const path = require('path')
const flash = require('express-flash')
const route = require('./routes/client/index.route.js')
const routeAdmin = require('./routes/admin/index.route.js')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const moment = require('moment')

require("dotenv").config()

//database connnect
const database = require('./config/database.js')
database.connect()

const systemConfig = require("./config/prefix.js")

const app = express()
const port = process.env.PORT

//method-override
app.use(methodOverride('_method'))

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//flash
app.use(cookieParser('keyboard cat'));
app.use(expressSession({ cookie: { maxAge: 60000 } }));
app.use(flash());

//Pug
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

//Public
app.use(express.static(`${__dirname}/public`))

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

route(app)
routeAdmin(app)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})