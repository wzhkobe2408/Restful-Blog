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
var User = require('./models/user')


var secret = require('./config/secret')

var app = express();

var commentRoute = require('./routes/comment')
var blogRoute = require('./routes/blog')
var reportRoute = require('./routes/report')
var userRoute = require('./routes/user')
var reportRoute = require('./routes/report')
var dashboardRoute = require('./routes/dashboard')
var serviceRoute = require('./routes/service')


mongoose.connect(secret.database,{ useMongoClient: true });
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
app.use('/blogs/:id/comments', commentRoute)
app.use(reportRoute)
app.use(serviceRoute)

//Email Routes
app.get('/email',function(req, res) {
	User.findById(req.user.id)
		.then(function(foundUser){
			foundUser.isManage = true;
			foundUser.save();
		})
		.catch(function(err) {
			console.log(err);
		})
  var receiveEmail = req.user.email;
  console.log(req.user.email);
  var helper = require('sendgrid').mail;
  var fromEmail = new helper.Email('XJTUvolunteer@example.com');
  var toEmail = new helper.Email(receiveEmail);
  var subject = 'Verify your email';
  var content = new helper.Content('text/plain', 'If you have applied for admin, please verify your email by click the link below.\nhttp://localhost:3000/admin/apply/'+req.user._id);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);

  var apiKey = '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';

  var sg = require('sendgrid')(apiKey);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
	sg.API(request, function (error, response) {
	  if (error) {
		res.send('There is something wrong');
	  }
	  req.flash('success','Please Check your email to verify');
	  res.redirect('/blogs');
	});
});

app.listen(3000,function() {
  console.log("App is listening on port 3000...")
})
