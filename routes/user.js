var express = require('express')
var router = express.Router()
var User = require('../models/user')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var multer = require('multer')
var path = require('path')

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback:true
  },
  function(req, email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, req.flash('error','Account not found')); }
      if (!user.comparePassword(password)) { return done(null, false, req.flash('error','Password is wrong')); }
      return done(null, user);
    });
  }
));

router.get('/login',function(req, res) {
  res.render('accounts/login',{
    error:req.flash('error')
  })
})

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  function(req, res) {
    req.flash('success','Welcome to RestBlog')
    res.redirect('/');
  });

router.get('/signup', function(req, res) {
  res.render('accounts/signup',{
    error:req.flash('error')
  })
})

router.post('/signup', function(req, res) {
  var newUser = new User();
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.email = req.body.email;
  if(!newUser.username || !newUser.password || !newUser.email){
    req.flash('error','All the fields are required');
    return res.redirect('/signup');
  }
  User.findOne({email:req.body.email})
    .then(function(existingUser) {
      if(existingUser){
        req.flash('error','Account with that email already exists')
        res.redirect('/signup')
      } else {
        if(req.body.password !== req.body.passwordConfirm){
          req.flash('error','Password not match')
          res.redirect('/signup');
        }
      }
    })
    .catch(function(err) {
      console.log(err)
    })

  newUser.save()
    .then(function(user){
      req.logIn(user, function(){
        req.flash('success','Welcome to RestBlog')
        res.redirect('/');
      })
      .catch(function(err) {
        req.flash('error',err);
        res.redirect('/signup')
      })
    }
  )
})

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success','Logged you out');
  res.redirect('/');
})

router.get('/users/:id/profile/', function(req, res) {
  User.findById(req.params.id)
    .then(function(foundUser) {
      res.render('accounts/profile',{
        user:foundUser,
      })
    })
    .catch(function(err) {
      req.flash('error','There is something wrong');
      res.redirect('/');
    })
})

//router.post('/users/:id/profileImage',function(req, res) {
  //res.send('You have submitted');
//})
//set storage engine
var storage = multer.diskStorage({
  destination:'./public/uploads/',
  filename:function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() +
    path.extname(file.originalname));
  }
});

//init upload
var upload = multer({
  storage:storage,
  limits:{fileSize:1000000},
  fileFilter:function(req, file ,cb) {
    checkFileType(file, cb);
  }
}).single('myAvatar');

//check fileType
function checkFileType(file, cb) {
  //allowed extensions
  var filetypes = /jpeg|jpg|png|gif/;
  //check extname
  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mimetype
  var mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post('/users/:id/profileImage', function(req, res) {
  User.findById(req.params.id)
    .then(function(foundUser) {
      upload(req, res, (err) => {
        if(err) {
          res.render('accounts/profile');
        } else {
          if(req.file == undefined) {
            res.render('accounts/profile');
          } else {
            foundUser.userProfile.avatar = '/uploads/' + req.file.filename;
            foundUser.save()
              .then(function(){
                var url = '/users/' + foundUser._id + '/profile';
                console.log(url);
                res.redirect(url)
                }
              )
              .catch(function(err) {
                var url = '/users/' + foundUser._id + '/profile';
                console.log(url);
                res.redirect(url)
              });
          }
        }
      });
    })
    .catch(function(err) {
      console.log(err);
    })
})

router.get('/admin/apply/:id', function(req, res) {
  User.findById(req.params.id)
    .then(function(foundUser) {
      foundUser.isManage = true;
      foundUser.save()
        .then(function() {
          req.flash('success','You have successfully become Admin');
          res.redirect('/');
        })
        .catch(function(err) {
          console.log(err);
          req.flash('error','Opps, something went wrong');
          res.redirect('/');
        })
    })
    .catch(function(err) {
      console.log(err);
      req.flash('error','Opps, something went wrong');
      res.redirect('/');
    })
})

module.exports = router
