var express = require('express')
var router = express.Router()
var Blog = require('../models/blog')
var User = require('../models/user')

//任务列表页/首页
router.get('/', function(req,res) {
  res.redirect('/blogs');
})

//任务列表页/首页
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

//管理员通过表单发布新的任务
router.post('/blogs',isLoggedin,function(req, res) {
  User.findById(req.user._id,function(err, foundUser) {
    if(err) {
      console.log(err);
      return res.redirect('/blogs');
    } else {
      var newBlog = req.body.blog;
      Blog.create(newBlog, function(err, newBlog) {
        if(err) {
          console.log(err);
          return res.redirect('/blogs');
        } else {
          newBlog.author.id = req.user._id;
          newBlog.author.username = req.user.username;
          newBlog.save();
          foundUser.releasedTasks.push(newBlog);
          foundUser.save(function(err) {
            if(err) {
              console.log(err);
              return res.redirect('/blogs');
            } else {
              req.flash('success','Successfully post new blog');
              return res.redirect('/blogs');
            }
          })
        }
      })
    }
  })
})

//新增任务表单页
router.get("/blogs/new",isLoggedin,function(req,res) {
  res.render("new");
})

//查看任务详情页
router.get('/blogs/:id',isLoggedin,function(req, res) {
  Blog.findById(req.params.id).populate('comments').exec(function(err, foundBlog){
    if(err) {
      console.log(err);
      res.redirect('/blogs')
    } else {
      res.render('show',{blog:foundBlog, success:req.flash('success')})
    }
  })
})

//编辑/更新任务表单页
router.get('/blogs/:id/edit',isLoggedin,function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      res.redirect('/blogs')
    } else {
      res.render("edit",{blog:foundBlog})
    }
  })
})

//表单发送put请求 更新任务内容
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

//管理员删除自己发布的任务
router.delete('/users/:id/releasedtasks/:blogId', function(req, res) {
  User.update(
    {_id: req.params.id},
    { $pull: {releasedTasks: req.params.blogId } }
  )
  .then(function(updatedUser) {
    Blog.findByIdAndRemove(req.params.blogId, function(err) {
      if(err) {
        console.log(err);
      } else {
        req.flash('success','Successfully withdraw task');
        res.redirect('/blogs');
      }
    })
  })
  .catch(function(err) {
    console.log(err);
  })
})

//用户接任务     input type="hidden" 隐藏表单记录任务id
router.post('/users/:id/tasks', function(req, res) {
	User.findById(req.params.id)
		.then(function(foundUser) {
			var id = req.body.blogId;
			Blog.findById(id)
				.then(function(foundBlog) {
					foundBlog.taskTaker.username = foundUser.username;
					foundBlog.taskTaker.id = foundUser._id;
          foundBlog.taken = true;
					foundBlog.save()
						.then(function(foundBlog) {
							foundUser.takenTasks.push(foundBlog);
              foundUser.save()
                .then(function() {
                  req.flash('success','Successfully take new task');
    							res.redirect('/users/' + foundUser._id + '/tasks');
                })
							  .catch(function(err) {
                  console.log(err);
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
		.catch(function(err) {
			console.log(err);
			req.flash('error','Something went wrong');
			res.redirect('back');
		})
})

//用户获取自身的任务列表和任务回馈
router.get('/users/:id/tasks', function(req, res) {
  User.findById(req.params.id).populate("takenTasks")
    .then(function(foundUser) {
      res.render('accounts/taskfeedback',{
        success:req.flash('success'),
        user:foundUser
      })
    })
    .catch(function(err) {
      req.flash('error','There was something wrong');
      res.redirect('back');
    })
})

//用户查看自己的任务列表内的任务详情页
router.get('/users/:id/tasks/:taskId', function(req, res) {
  User.findById(req.params.id)
    .then(function(foundUser) {
      Blog.findById(req.params.taskId)
        .then(function(foundBlog) {
          res.render('task/show', {
            task:foundBlog
          });
        })
        .catch(function(err) {
          console.log(err);
        })
    })
    .catch(function(err) {
      console.log(err);
    })
})

//中间件   判断是否登录
function isLoggedin(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error','You need to login first');
  res.redirect('/login');
}

module.exports = router
