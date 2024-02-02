require('./routes')
const { restoreSessions } = require('./sessions')
const { routes } = require('./routes')
const {auth_routes} = require('./login system/routes')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { maxAttachmentSize } = require('./config')
const session = require('express-session');

// Initialize Express app
app.disable('x-powered-by')
app.set('views', './src/login system/src/views')
app.set('view engine', 'ejs')
app.use(bodyParser.json({ limit: maxAttachmentSize + 1000000 }))
app.use(bodyParser.urlencoded({ limit: maxAttachmentSize + 1000000, extended: true }))
app.use(session({
    secret: 'your-secefwewfret-key', // Change this to a secure, random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(express.static('./src/login system/src/views/public'));
app.use('/', auth_routes)
app.use('/', routes)

restoreSessions()

module.exports = app
