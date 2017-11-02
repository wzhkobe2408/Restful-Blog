var express = require('express')
var router = express.Router()
var User = require('../models/user')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

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

router.get('/profile/:id', function(req, res) {
  User.findById(req.params.id)
    .then(function(foundUser) {
      res.render('accounts/profile',{
        user:foundUser
      })
    })
    .catch(function(err) {
      req.flash('error','There is something wrong');
      res.redirect('/');
    })
})

module.exports = router
