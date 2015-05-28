var moment = require('moment');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');

var postsDir = __dirname + '/../posts/';
fs.readdir(postsDir, function(error, directoryContents) {
  if (error) {
    throw new Error(error);
  }

  function comparePostByDate(post1, post2) {
    return post2.realNum-post1.realNum
  }

  var posts = directoryContents.map(function(fileName) {

    var postName = fileName.replace('.md', '');
    var contents = fs.readFileSync(postsDir + fileName, {encoding: 'utf-8'}); 
    var splitArr = contents.split("---\n")
    
    var metaData = splitArr[1];
    var postContents = splitArr[2];
   
    var dataSplit = metaData.split("\n"); 
    var dataSplitTitle = dataSplit[0];
    var dataSplitAuthor = dataSplit[1];
    var dataSplitDate = dataSplit[2];

    var postTitle = dataSplitTitle.split(":")[1];
    var postAuthor = dataSplitAuthor.split(":")[1];
    var postDate = dataSplitDate.split(":")[1];
    
    console.log(postTitle);

    var dateMS = moment(postDate).format("x");
    console.log(dateMS);

    var dateNum = parseInt(dateMS)

    return {postName: postName, postContents: marked(postContents), postTitle: postTitle, postAuthor: postAuthor, postDate: postDate, realNum: dateNum};
  });

posts.sort(comparePostByDate);

for (var i=0; i<posts.length; i++) {
  if (i!=0) {
    posts[i].next = posts[i-1].postName
    posts[i].nextURL = "./"+posts[i].next
  }
  if (i<posts.length-1) {
    posts[i].previous = posts[i+1].postName
    posts[i].previousURL = "./"+posts[i].previous
  }
};


  /* GET home page. */
  router.get('/', function(request, response) {
    response.render('index', { posts: posts, title: '~~ Welcome to the Thunderdome ~~'});
  });

  //render the post list, sequencing by the sort function
  //keep the postName and postTitle info

  posts.forEach(function(post) {
    router.get('/' + post.postName, function(request, response) {
      response.render('post', post);
    });
  });
});

module.exports = router;