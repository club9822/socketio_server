import helmet from "helmet";
import {JWT} from "./Config/jwt";
var fs = require('fs');
var session = require('express-session')
var path = require('path');
const cors = require('cors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var dbRouter = require('./routes/db');
// set ssl
var options = {
  // key: fs.readFileSync('./openssl_keys/server_key.pem'),
  // cert: fs.readFileSync('./openssl_keys/server_cert.pem')
};
var app = express();
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,maxAge: 60000 }
}))
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/db',JWT.verifyToken,dbRouter)
module.exports = app;
