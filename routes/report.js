var express = require('express')
var router = express.Router()

router.get('/report/new',isLoggedin,function(req, res) {
  res.render('report/new')
})

function isLoggedin(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error','You need to login first');
  res.redirect('/login');
}

module.exports = router
