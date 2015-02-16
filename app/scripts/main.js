$.getJSON('http://www.reddit.com/r/malefashionadvice/search.json?q=selftext:WAYWT = What Are You Wearing Today&syntax=lucene&restrict_sr=true&sort=new&limit=1', function(response) {
  var thread = response.data.children[0].data;
  $.getJSON(thread.url + '.json?jsonp=?', function(response) {
    var comments = response[1].data.children;
    var images = [];
    for (var i = 0; i < comments.length - 1; i++) {
      var commentLink = comments[i].data.body_html.match(/a href="([^"]*)/)[1]; // comments with a URL present
      if (commentLink.split('.').pop() === 'jpg') { // checks if link ends in .jpg
        images.push(commentLink); 
      }
    }
    for (var i = 0; i < images.length; i ++) {
      $('#images').append('<img src=' + images[i] + ' class="image" />');
      console.log(images.length);
    }
  });
});