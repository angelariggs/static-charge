var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to the Thunderdome' });
});

var postsDir =
fs.readdir(postsDir, function(error, directoryContents) {
  if(error) {
    throw new Error(error);
  }
  directoryContents.forEach(function(postFileName) {
    var postName = postFilename.replace('.md', '');
    fs.readFile(postsDir + postFilename, {encoding: 'utf-8'}, function(error, fileContents) {
      if (error) {
        throw new Error(error);
      }
      var renderedPost = marked(fileContents);
      console.log(renderedPost);

      router.get('/' + postName, function(request, response) {
        response.render('post', {postContents: renderedPost});
      });
    });
  });
});

module.exports = router;
