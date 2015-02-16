$.getJSON('http://www.reddit.com/r/malefashionadvice/search.json?q=selftext:WAYWT = What Are You Wearing Today&syntax=lucene&restrict_sr=true&sort=new&limit=1', function(response) {
  var thread = response.data.children[0].data;
  $.getJSON(thread.url + '.json?jsonp=?&sort=top', function(response) {
    var comments = response[1].data.children;
    var images = [];
    for (var i = 0; i < comments.length - 1; i++) {
      var commentLink = comments[i].data.body_html.match(/a href="([^"]*)/)[1]; // comments with a URL present
      if (commentLink.split('.').pop() === 'jpg') { // checks if link ends in .jpg
        images.push(commentLink); 
      } else if (commentLink.toLowerCase().indexOf("imgur.com") >= 0 // if URL is an imgur link
                && commentLink.toLowerCase().indexOf("imgur.com/a/") <= 0 // and it's not an album
                && commentLink.toLowerCase().indexOf("imgur.com/gallery") <= 0 // or a gallery
                && commentLink.toLowerCase().indexOf(",") <= 0) // or has a comma in it
      {
        commentLink += '.jpg'; // append .jpg to end of the URL
        images.push(commentLink); 
      }
    }
    $('img').error(function(){
      $(this).hide();
    });
    for (var i = 0; i < images.length; i ++) {
      $('#images').append('<img src=' + images[i] + ' class="image" />');
    }
  });
});