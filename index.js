const express = require('express')
const path = require('path')
const methodOverride = require('method-override') //Thêm DELETE và PATCH khi gửi form bằng HTML
const bodyParser = require('body-parser') //Để lấy req.body
const flash = require('express-flash')  //kết hợp với Cookie Parser và expressSession để tạo flash thông báo
const cookieParser = require('cookie-parser') //dùng cho flash và dùng cho res.cookie hay req.cookies
const expressSession = require('express-session')
const moment = require('moment')
const http = require('http')
const { Server } = require("socket.io")

const route = require('./routes/client/index.route.js')
const routeAdmin = require('./routes/admin/index.route.js')
const systemConfig = require("./config/prefix.js")
const database = require('./config/database.js')

//ENV
require("dotenv").config()

//DB Connect
database.connect()

const app = express()
const port = process.env.PORT

//Socket
const server = http.createServer(app)
const io = new Server(server)
global._io = io

//Method-override
app.use(methodOverride('_method'))

//Create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

//Flash
app.use(cookieParser('keyboard cat'));
app.use(expressSession({ cookie: { maxAge: 60000 } }))
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

//Route
route(app)
routeAdmin(app)

//404
app.get('*', (req, res) => {
    res.render('clients/pages/error/404.pug', {
        pageTitle: "Hỏng"
    })
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})