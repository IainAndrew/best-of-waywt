var counter = parseInt(window.location.hash.slice(1)),
    $newer = $('#newer'),
    $older = $('#older'),
    $newest = $('#newest');

$newer.on('click', function() {
  if (counter !== 0) {
    counter -= 1;
    request();
  }
});

$older.on('click', function() {
  counter += 1;
  request();
});

$newest.on('click', function() {
  if (counter !== 0) {
    counter = 0;
    request();
  }
});

function masonryInit() {
  $('#images').imagesLoaded(function() {
    $('#images').masonry({
      itemSelector: '.image',
      isAnimated: true
    });
  });
}

function changeUrl() {
  history.pushState('', '', '#' + counter + '/' + 'feb');
}

request();
masonryInit();

function request() {
  $('#images').empty();
  if (isNaN(counter)) {
    counter = 0;
  }
  //changeUrl();
  //thread.title.toLowerCase().slice(7).replace(/\s/g, '').replace('.','-');
  $.getJSON('http://www.reddit.com/r/malefashionadvice/search.json?q=selftext:WAYWT = What Are You Wearing Today&syntax=lucene&restrict_sr=true&sort=new', function(response) {
    var thread = response.data.children[counter].data,
        $heading = $('#heading');
    $heading.html(thread.title);
    history.pushState('', '', '#' + counter + '/' + thread.title.toLowerCase().slice(7).replace(/\s/g, '').replace('.','-'));
    //window.location.hash = thread.title.toLowerCase().slice(7).replace(/\s/g, '').replace('.','-');
    //window.location.replace('#' + counter);
    $.getJSON(thread.url + '.json?jsonp=?&sort=top', function(response) {
      var comments = response[1].data.children;
      var images = [];
      for (var i = 0; i < comments.length - 1; i++) {
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
         && endsWith(commentLink, '.jpg') === false && endsWith(commentLink, '.png') === false && endsWith(commentLink, '.gif') === false) // or already ends with .jpg or .png or .gif
        {
          commentLink += '.jpg'; // append .jpg to end of the url
          images.push(commentLink); 
        } else if (endsWith(commentLink, '.jpg') === true || endsWith(commentLink, '.png') === true || endsWith(commentLink, '.gif') === true) {
          images.push(commentLink); 
        }
      }
      $('img').error(function(){
        $(this).hide();
      });
      for (var i = 0; i < images.length; i ++) {
        // append images to the container and reinitialise masonry
        $('#images').append('<div class="image"><img src=' + images[i] + '>').masonry().masonry('destroy').imagesLoaded(function(){$('#images').masonry()});
      }
    });
  });
}