//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose');
// var posts = [];

mongoose.connect('mongodb://localhost:27017/blog_data');
const Post = mongoose.model('Post', {
  title:{
    type: String,
    required:[true,"Enter a title for the blog."]
  },
  body:String
});

const homeStartingContent = "Then you'll remember your life as a book of candles. Each page read by the light of it's own burning."+"\n"+"- Lee Young";
const aboutContent = "When does the path we walk on, Lock around our feet? When does the road become a river with only one destination? Death waits for us all in Samarra. But can Samarra be avoided?";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req,res){
  Post.find({}, function(err, foundPosts){
    res.render("home", {hContent:homeStartingContent, blog_posts:foundPosts});
  });
});

app.get("/contact",function(req,res){
  res.render("contact", {conContent:contactContent});
});

app.get("/about", function(req,res){
  res.render("about", {abtContent:aboutContent});
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.post("/compose", function(req,res){
  // let post = {
  //   "title" : req.body.blog_title,
  //   "body" : req.body.blog_text
  // };
  // posts.push(post);

  const post = new Post({
    title: req.body.blog_title,
    body: req.body.blog_text
  });
  post.save(function(err){
    if(!err){
      res.redirect('/');
    }
  });
});

app.get('/posts/:postId',function(req,res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId}, function(err, foundPost){
    res.render("post", {title:foundPost.title, content:foundPost.body});
  });


  // const name = _.lowerCase(req.params.postName);

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);
  //   if(storedTitle === name){
  //     res.render("post", {title:post.title, content:post.body});
  //   }
  // });

});

app.listen(3000, function() {
  console.log("<---------------Server started on port 3000--------------->");
});
