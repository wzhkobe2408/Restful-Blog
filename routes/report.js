var express = require('express')
var router = express.Router()
var Report = require('../models/report')
var User = require('../models/user')
var Blog = require('../models/blog')
var Service = require('../models/service')

router.get('/reports/new',isLoggedin,function(req, res) {
  Service.find()
    .then(function(foundServices) {
      res.render('report/new',{
        foundServices:foundServices
      })
    })
    .catch(function(err) {
      console.log(err);
    })
})

router.post('/reports',isLoggedin,function(req, res) {
  //prepare
  var newReport = new Report();
  newReport = req.body.report;
  var author = {
    id:req.user._id,
    username:req.user.username
  }
  newReport.author = author;
  //create
  Report.create(newReport)
    .then(function(report) {
      User.findById(req.user._id)
        .then(function(foundUser) {
          foundUser.reports.push(report);
          foundUser.save()
            .then(function(foundUser) {
              req.flash('success','Successfully submit report');
              res.redirect(`/users/${foundUser._id}/reports`);
            })
            .catch(function(err) {
              console.log(err);
            })
        })
        .catch(function(err) {
          console.log(err);
          req.flash('error','Something went wrong');
          res.redirect('/reports/new');
        })
    })
    .catch(function(err) {
      console.log(err);
      req.flash('error','Something went wrong');
      return res.redirect('/reports/new');
    })
})

router.get('/users/:id/reports', function(req, res) {
  User.findById(req.params.id).populate('reports')
    .then(function(foundUser) {
      res.render('accounts/report',{
        user:foundUser,
        success:req.flash('success')
      })
    })
    .catch(function(err) {
      req.flash('error','There is something wrong');
      res.redirect('/');
    })
})

router.get('/reports/:id',function(req, res) {
    Report.findById(req.params.id,function(err, foundReport) {
      res.render('report/show',{
        report:foundReport
      })
    })
})

router.get('/reports/:id/edit',function(req, res) {
    Report.findById(req.params.id,function(err, foundReport) {
      if(err) {
        return console.log(err);
      }
      res.render('report/edit',{
        report:foundReport
      })
    })
})

router.delete('/users/:userId/reports/:id', function(req, res) {
    User.update(
      {_id: req.params.userId},
      { $pull: {reports: req.params.id } }
    )
    .then(function() {
      User.findById(req.params.userId)
        .then(function(foundUser) {
          Report.findByIdAndRemove(req.params.id, function(err) {
            if(err) {
              console.log(err);
            } else {
              req.flash('success','Successfully deleted report');
              res.redirect('/users/' + foundUser._id + '/reports');
            }
          })
        })
        .catch(function(err) {
          console.log(err);
        })
    })
    .catch(function(err) {
      console.log(err);
    })
})

router.put('/users/:userId/reports/:id', function(req, res) {
    User.findById(req.params.userId)
      .then(function(foundUser) {
        Report.findByIdAndUpdate(req.params.id,req.body.report,function(err, updatedReport) {
          if(err) {
            console.log(err);
          } else {
            req.flash('success','Successfully updated report');
            res.redirect('/users/' + foundUser._id + '/reports');
          }
        })
      })
      .catch(function(err) {
        console.log(err);
      })
})

function isLoggedin(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error','You need to login first');
  res.redirect('/login');
}

module.exports = router
