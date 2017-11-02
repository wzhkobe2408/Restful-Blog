var express = require('express')
var router = express.Router()
var Blog = require('../models/blog')

router.get('/', function(req,res) {
  res.redirect('/blogs');
})

router.get('/blogs',function(req,res){
  Blog.find({},function(err, blogs) {
    if(err) {
      console.log(err)
    } else {
      res.render("index",{
        blogs:blogs,
        success:req.flash('success')
      })
    }
  })
})

router.post('/blogs',isLoggedin,function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog) {
    if(err) {
      res.render('new')
    } else {
      res.redirect('/blogs')
    }
  })
})

router.get("/blogs/new",isLoggedin,function(req,res) {
  res.render("new");
})

router.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err){
      res.redirect('/blogs')
    }else {
      res.render('show',{blog:foundBlog})
    }
  })
})

router.get('/blogs/:id/edit',isLoggedin,function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      res.redirect('/blogs')
    } else {
      res.render("edit",{blog:foundBlog})
    }
  })
})

router.put('/blogs/:id',isLoggedin,function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
    if(err){
      res.redirect('/blogs')
    } else {
      res.redirect('/blogs/' + req.params.id)
    }
  })
})

router.delete('/blogs/:id',isLoggedin,function(req, res) {
  Blog.findByIdAndRemove(req.params.id,function(err) {
    if(err) {
      res.redirect('/blogs')
    } else {
      res.redirect('/blogs')
    }
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
