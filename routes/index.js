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

  var sort;
  var arrMS = []
  function compareNums(a,b) {
    return b-a
  }

  var posts = directoryContents.map(function(fileName) {

    var postName = fileName.replace('.md', '');
    var contents = fs.readFileSync(postsDir + fileName, {encoding: 'utf-8'}); 
    var metaData = contents.split("---")[1];
    var postContents = contents.split("---")[2];
   
    var dataSplit = metaData.split("\n")[1]; 
   

    var dataSplitTitle = metaData.split("\n")[1];
    var postTitle = dataSplitTitle.split(":")[1];
    console.log(postTitle);

    var dataSplitAuthor = metaData.split("\n")[2];
    var postAuthor = dataSplitAuthor.split(":")[1];
    console.log(postAuthor);

    var dataSplitDate = metaData.split("\n")[3];
    var postDate = dataSplitDate.split(":")[1];
    var dateMS = moment(postDate).format("x");
    arrMS.push(dateMS);
    console.log(arrMS);
    sort = arrMS.sort(compareNums)
    console.log(sort);

    return {postName: postName, postContents: marked(postContents), postTitle: postTitle, postAuthor: postAuthor, postDate: postDate};
  });

  /* GET home page. */
  router.get('/', function(request, response) {
    response.render('index', { posts: posts, title: '~~ Welcome to the Thunderdome ~~'});
  });

  //render the post list, sequencing by the sort function
  //keep the postName and postTitle info

  posts.forEach(function(post) {
    router.get('/' + post.postName, function(request, response) {
      response.render('post', {postTitle: post.postTitle, postAuthor: post.postAuthor, postDate: post.postDate, postContents: post.postContents});
    });
  });
});

module.exports = router;