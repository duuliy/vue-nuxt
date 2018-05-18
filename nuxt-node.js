import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import path from 'path'

const bodyParser = require("body-parser");

import api from './api'

const app = express()

//old  HOST:127.0.0.1 PORT:8888
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8888

//缓存策略
app.use(cookieParser());
app.use(session({
    name:"yuzhua-cookies",  //cookie名称，默认connect.sid
    secret:"123456", //加密的密码
    cookie:{maxAge:300000},
    resave:true,
    rolling:true,
    saveUninitialized:true
}));

app.set('port', port)
app.set("server",path.join(__dirname,"server"));  //视图文件路径
app.all('*', (req, res, next)=> {
    res.header("Access-Control-Allow-Methods","POST,GET,PUT,DELETE,PATCH")
    next()
});
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
// Import API Routes
app.use('/api', api)
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}



// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
