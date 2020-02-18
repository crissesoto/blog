//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const truncate = require('truncate');
const mongoose = require('mongoose');


const port = process.env.port || 4000;


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// MongoDB AND Mongoose
mongoose.connect('mongodb://localhost/blogsDB', {useNewUrlParser: true, useUnifiedTopology: true });

// Checknif we connect successfully
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to db: BlogsDB")
});

// blog schema
const blogSchema =  new mongoose.Schema({
  postTitle: String,
  postContent: String
});

// Create a model based on the 'blogSchema' schema
const Blog = mongoose.model("Blog", blogSchema);






// Global scope variables
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



// ---------> home page
app.get("/", function(req, res){

  // render home.ejs page as home route

  Blog.find(function (err, blogs) {
    if (err) return console.error(err);
    //console.log(blogs);
    res.render(__dirname + "/views/home.ejs", {
      posts: blogs, 
      para: homeStartingContent,
      title:"Home",
      truncate: truncate,
      _: _
    });
  })

});


// --------->  about page
app.get("/about", function(req, res){

  // render about.ejs page as about route
  res.render(__dirname + "/views/about.ejs", {
    title: "About", 
    para: aboutContent
  });
});


// --------->  post page
app.get("/posts/:postID", function(req, res){
  const postID = _.lowerCase(req.params.postID);

  Blog.find(function (err, blogs) {
    if (err) return console.error(err);
    
    for (let i = 0; i < blogs.length; i++) {
      const blogID = _.lowerCase(blogs[i]._id);
      
      if (blogID === postID) {
        console.log("match found!")
        res.render("posts.ejs", {
          title: blogs[i].postTitle,
          posts: blogs[i].postContent,
          _id: blogs[i]._id
        })
      }
    }

  })
});


// --------->  contact page
app.get("/contact", function(req, res){

  // render home.ejs page as home route
  res.render(__dirname + "/views/contact.ejs", {
    title: "Contact", 
    para: contactContent
  });
});


// --------->  hidden compose page
app.get("/compose", function(req, res){

  // render home.ejs page as home route
  res.render(__dirname + "/views/compose.ejs", {
    title: "Compose"
  });
});

app.post("/compose", function(req, res){
  //console.log(req.body);
  const buttonNewPost = req.body.buttonNewPost;

  // create a blog document
  const newBlog = new Blog({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent
  });


  newBlog.save(function (err) {
    if (!err) {
      res.redirect("/");
    }else{
      console.error(err)
    };
  });

});









//  ---------> Port
app.listen(port, function(){
  console.log(`Server started at port: ${port}`);
})
