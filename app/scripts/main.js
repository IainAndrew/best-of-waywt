var counter = parseInt(window.location.hash.slice(1)),
    $newer = $('#newer'),
    $older = $('#older'),
    $newest = $('#newest'),
    $shoeMode = $('#shoe-mode'),
    $container = $('#images');

$newer.on('click', function(e) {
  e.preventDefault();
  if (counter !== 0) {
    counter -= 1;
    request();
  }
});

$older.on('click', function(e) {
  e.preventDefault();
  counter += 1;
  request();
});

$newest.on('click', function(e) {
  e.preventDefault();
  if (counter !== 0) {
    counter = 0;
    request();
  }
});
var shoeMode = false;
$shoeMode.on('click', function(e) {
  //e.preventDefault();
  if (shoeMode) {
    shoeMode = false;
  } else {
    shoeMode = true;
  }
  request();
  counter = 0;
});

function masonryInit() {
  $container.masonry().masonry('destroy').imagesLoaded().always(function() {
    $container.masonry({
      itemSelector: '.card',
      isAnimated: true
    });
  });
}
if (window.location.hash.indexOf('shoemode') > -1) { // necessary for direct linking to a shoemode page
  shoeMode = true;
  $shoeMode.attr('checked', true);
} else {
  shoeMode = false;
}
function request() {
  $container.empty();
  if (isNaN(counter)) {
    counter = 0;
  }
  if (counter === 24) {
    $older.addClass('disabled');
  } else {
    $older.removeClass('disabled');
  }
  if (!shoeMode) {
    var searchQuery = 'q=selftext:WAYWT = What Are You Wearing Today';
    //$shoeMode.removeClass('shoe-mode-on');
  } else {
    searchQuery = 'q=title:WshoeAYWT';
    //$shoeMode.addClass('shoe-mode-on');
  }
  $.getJSON('http://www.reddit.com/r/malefashionadvice/search.json?' + searchQuery + '&syntax=lucene&restrict_sr=true&sort=new', function(response) {
    var thread = response.data.children[counter].data;

    var $threadTitle = $('#thread-title');
    $threadTitle.html(thread.title); // bind thread title to #thread-title

    if (!shoeMode) {
      history.pushState('', '', '#' + counter + '/' + thread.title.toLowerCase().slice(7).replace(/\s/g, '').replace('.','-'));
    } else {
      history.pushState('', '', '#' + counter + '/shoemode/' + thread.title.toLowerCase().slice(9).replace(/\s/g, '').replace('.','-'));
    }

    $.getJSON(thread.url + '.json?jsonp=?&sort=top', function(response) {
      var comments = response[1].data.children;
      var images = [];

      for (var i = 0; i < comments.length - 1; i++) {
        var match = comments[i].data.body_html.match(/a href="([^"]*)/); // extract urls from comments

        if (match) { // makes sure no urls are null so it doesn't break
          var commentLink = match[1]; 
        } else {
          continue;
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
        } else {
          images.push(commentLink); 
        }
      }

      for (var i = 0; i < images.length; i ++) {
        var imageTemplate = '<div class="card">' +
                              '<a href="#" class="img-link">' +
                                '<img src=' + '//res.cloudinary.com/duj6igl8q/image/fetch/w_300/' + images[i] + '>' + // cloudinary cdn link with resizing
                              '</a>' +
                              '<div class="card-info">' +
                                '<a class="author" href="//reddit.com/user/' + comments[i].data.author + '" target="_blank">' + comments[i].data.author + '</a>' +
                                '<span class="score icon-resize-vertical">' + comments[i].data.score + '</span>' +
                                '<a class="reddit-link icon-reddit" href=' + '//reddit.com' + thread.permalink + comments[i].data.id + ' target="_blank"></a>' +
                              '</div>' +
                            '</div>';
        $container.append(imageTemplate) // append images to the container and reinitialise masonry
                    .masonry().masonry('destroy').imagesLoaded().always(function(){
                      $container.masonry().masonry('reloadItems');
        });
      }
      $('img').error(function() {
        var viewOnTemplate = '<a class="view-on" target="_blank" href=' + $(this).attr("src").replace('//res.cloudinary.com/duj6igl8q/image/fetch/w_300/', '') + '><p><span>thumbnail unavailable</span>';
        if ( ($(this).attr('src').indexOf('drsd.so') > -1) || ($(this).attr('src').indexOf('dressed.so') > -1) ) {
          $(this).unbind('error').closest('.img-link').replaceWith(viewOnTemplate + '<span>view on dressed.so</span></p></a>');
        } else if ( ($(this).attr('src').indexOf('imgur.com') > -1) ) {
          $(this).unbind('error').closest('.img-link').replaceWith(viewOnTemplate + '<span>view on imgur</span></p></a>');
        } else if ( ($(this).attr('src').indexOf('reddit.com') > -1) ) {
          $(this).unbind('error').closest('.card').remove();
        } else {
          $(this).unbind('error').closest('.img-link').replaceWith(viewOnTemplate + '<span>view here</span></p></a>');
        }
        masonryInit();
      });

    });
  });
}

request();
masonryInit();

$.ajaxSetup({
    beforeSend:function(){
      $("#loading").addClass('show');
    },
    complete:function(){
      $container.imagesLoaded().always(function(){
        $("#loading").removeClass('show');
      });
    }
});