var express = require('express')
var router = express.Router({mergeParams:true})
var Comment = require('../models/comment')
var Blog = require('../models/blog')

router.post('/',isLoggedin, function(req, res) {
    Blog.findById(req.params.id)
      .then(function(foundBlog){
        Comment.create(req.body.comment)
          .then(function(comment) {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            foundBlog.comments.push(comment);
            foundBlog.save()
              .then(function(foundBlog) {
                req.flash('success','Successfully added comment');
                res.redirect('/blogs/' + foundBlog._id);
              })
              .catch(function(err) {
                console.log(err);
              })
          })
          .catch(function(err) {
            req.flash('error','Something went wrong');
            console.log(err);
          })
      })
      .catch(function(err) {
        console.log(err);
        res.redirect('/blogs/' + req.params.id)
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
