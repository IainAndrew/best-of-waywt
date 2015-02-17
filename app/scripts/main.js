$.getJSON('http://www.reddit.com/r/malefashionadvice/search.json?q=selftext:WAYWT = What Are You Wearing Today&syntax=lucene&restrict_sr=true&sort=new', function(response) {
  var thread = response.data.children[0].data;
  $.getJSON(thread.url + '.json?jsonp=?&sort=top', function(response) {
    var comments = response[1].data.children;
    var images = [];
    for (var i = 0; i < comments.length - 1; i++) {
      //var commentLink = comments[i].data.body_html.match(/a href="([^"]*)/)[1]; // extract url from comment
      var match = comments[i].data.body_html.match(/a href="([^"]*)/);
      if (match) {
        var commentLink = match[1];
      }
      function endsWith(str, suffix) {
        return str.toLowerCase().indexOf(suffix, str.length - suffix.length) !== -1;
      }
      if (commentLink.toLowerCase().indexOf("imgur.com") >= 0 // if url is an imgur link
       && commentLink.toLowerCase().indexOf("imgur.com/a/") <= 0 // and it's not an album
       && commentLink.toLowerCase().indexOf("imgur.com/gallery") <= 0 // or a gallery
       && commentLink.toLowerCase().indexOf(",") <= 0 // or has a comma in it
       && endsWith(commentLink, '.jpg') === false && endsWith(commentLink, '.png') === false)
      {
        commentLink += '.jpg'; // append .jpg to end of the url
        images.push(commentLink); 
      } else if (endsWith(commentLink, '.jpg') === true || endsWith(commentLink, '.png') === true) { // check if link ends in .jpg
        images.push(commentLink); 
      }
    }
    $('img').error(function(){
      $(this).hide();
    });
    for (var i = 0; i < images.length; i ++) {
      $('#images').append('<div class="image"><img src=' + images[i] + '>');
    }
  });
});