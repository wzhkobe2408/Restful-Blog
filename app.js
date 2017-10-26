var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override')
var expressSanitizer = require('express-sanitizer')

var app = express();

var Blog = require('./models/blog');

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended:true }))
app.use(methodOverride("_method"))
app.use(expressSanitizer())

app.get('/', function(req,res) {
  res.redirect('/blogs');
})

app.get('/blogs',function(req,res){
  Blog.find({},function(err, blogs) {
    if(err) {
      console.log(err)
    } else {
      res.render("index",{blogs:blogs})
    }
  })
})

app.post('/blogs', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog) {
    if(err) {
      res.render('new')
    } else {
      res.redirect('/blogs')
    }
  })
})

app.get("/blogs/new",function(req,res) {
  res.render("new");
})

app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err){
      res.redirect('/blogs')
    }else {
      res.render('show',{blog:foundBlog})
    }
  })
})

app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      res.redirect('/blogs')
    } else {
      res.render("edit",{blog:foundBlog})
    }
  })
})

app.put('/blogs/:id', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
    if(err){
      res.redirect('/blogs')
    } else {
      res.redirect('/blogs/' + req.params.id)
    }
  })
})

app.delete('/blogs/:id', function(req, res) {
  Blog.findByIdAndRemove(req.params.id,function(err) {
    if(err) {
      res.redirect('/blogs')
    } else {
      res.redirect('/blogs')
    }
  })
})

app.listen(3000,function() {
  console.log("App is listening on port 3000...")
})
