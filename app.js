var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override')
var expressSanitizer = require('express-sanitizer')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var flash = require('connect-flash')
var MongoStore = require('connect-mongo')(session)
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var secret = require('./config/secret')

var app = express();

var blogRoute = require('./routes/blog')
var userRoute = require('./routes/user')
var reportRoute = require('./routes/report')
var dashboardRoute = require('./routes/dashboard')

mongoose.connect(secret.database);
mongoose.Promise  = Promise;

app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(methodOverride("_method"))
app.use(expressSanitizer())
app.use(cookieParser())
app.use(session({
  secret:'this is the secret key',
  resave:false,
  saveUninitialized:false,
  store:new MongoStore({url:secret.database, autoReconnect:true})
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
})

app.use(blogRoute)
app.use(userRoute)
app.use(reportRoute)
app.use(dashboardRoute)

app.listen(3000,function() {
  console.log("App is listening on port 3000...")
})
