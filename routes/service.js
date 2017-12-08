var express = require('express')
var router = express.Router()
var Service = require('../models/service')

router.get('/service:page?',function(req, res) {
  Service.find()
    .then(function(foundServices) {
      res.render('service/index',{
        services:foundServices,
        pageCount:req.query.page
      });
    })
    .catch(function(err) {
      console.log(err);
    })
})

router.get('/service/new', function(req, res) {
  res.render('service/new',{
    error:req.flash('error'),
    success:req.flash('success')
  }
  );
})

router.post('/service/new', function(req, res) {
  var newServiceObj = new Service();
  newServiceObj = req.body.info;
  Service.nextCount(function(err, count) {
    newServiceObj.serviceId = count;
    Service.create(newServiceObj)
      .then(function(newServiceObj) {
        req.flash('success','成功添加新义工服务对象')
        res.redirect('/service/new');
      })
      .catch(function(err) {
        req.flash('error','添加失败，请重试');
        res.redirect('/service/new');
      })
  })
})

router.get('/service/:id', function(req, res) {
  Service.findById(req.params.id)
    .then(function(foundService) {
      res.render('service/show', {
        foundService:foundService
      });
    })
    .catch(function(err) {
      console.log(err);
    })
})



module.exports = router
