var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var postDir = __dirname + '/../posts/';
fs.readdir(postDir, function(error, directoryContents) {
  if(error) {
    throw new Error(error);
  }
  directoryContents.forEach(function(postFileName) {
    var postName = postFileName.replace('.md', '');
    fs.readFile(postDir + postFileName, {encoding: 'utf-8'}, function(error, fileContents) {
      if(error) {
        throw new Error(error);
      }

      var renderedPost = marked(fileContents);
      console.log(renderedPost);

      router.get('/' + postName, function(request, response) {
        response.render('post', {postContents: renderedPost});

    })
    });
  });
});

module.exports = router;