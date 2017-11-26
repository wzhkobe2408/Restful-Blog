var express = require('express')
var router = express.Router()

router.get('/service',function(req, res) {
  res.render('service/index')
})

router.get('/service/new', function(req, res) {
  res.render('service/new');
})

router.get('/service/:id', function(req, res) {
  res.render('service/show');
})



module.exports = router
