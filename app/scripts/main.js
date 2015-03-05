var counter = parseInt(window.location.hash.slice(1)), // get integer value from url hash
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
  $container.masonry().masonry('destroy').imagesLoaded().always(function() { // initialise masonry after images have loaded
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
  if (counter === 24) { // remove option to view older thread when on 25th thread
    $older.addClass('disabled');
  } else {
    $older.removeClass('disabled');
  }
  if (!shoeMode) {
    var searchQuery = 'q=selftext:WAYWT = What Are You Wearing Today author:MFAModerator';
    //$shoeMode.removeClass('shoe-mode-on');
  } else {
    searchQuery = 'q=title:WshoeAYWT';
    //$shoeMode.addClass('shoe-mode-on');
  }
  $.getJSON('//www.reddit.com/r/malefashionadvice/search.json?' + searchQuery + '&syntax=lucene&restrict_sr=true&sort=new', function(response, xhr) {   // main callback function
    if(xhr.status == 500 || xhr.status == 404 || xhr.status == 503) { // if server error is thrown
      requestError();
    } else {
      requestSuccess(response);
    }
  });
  var $threadTitle = $('#thread-title');
  function requestError() {
    $threadTitle.html('Reddit server error! Try again later.');
  }
  function requestSuccess(response) {
    var thread = response.data.children[counter].data;

    $threadTitle.html(thread.title); // bind thread title to #thread-title

    if (!shoeMode) {
      history.pushState('', '', '#' + counter + '/' + thread.title.toLowerCase().slice(7).replace(/\s/g, '').replace('.','-')); // add url pushstate with some formatting
    } else {
      history.pushState('', '', '#' + counter + '/shoemode/' + thread.title.toLowerCase().slice(9).replace(/\s/g, '').replace('.','-')); // add url pushstate with some formatting
    }

    $.getJSON(thread.url + '.json?jsonp=?&sort=top', function(response) {
      var comments = response[1].data.children;
      var images = [];

      for (var i = 0; i < comments.length - 1; i++) {
        var match = comments[i].data.body_html.match(/a href="([^"]*)/); // extract urls from comments

        if (match) {
          var commentLink = match[1];
        } else {
          comments.splice(i, 1); // if url is null remove it
        }

        function endsWith(str, suffix) {
          return str.toLowerCase().indexOf(suffix, str.length - suffix.length) !== -1;
        }

        if (commentLink.toLowerCase().indexOf("imgur.com") >= 0 // if url is an imgur link
         && commentLink.toLowerCase().indexOf("imgur.com/a/") <= 0 // and it's not an album
         && commentLink.toLowerCase().indexOf("imgur.com/gallery") <= 0 // or a gallery
         && commentLink.toLowerCase().indexOf(",") <= 0 // or has a comma in it
         && endsWith(commentLink, '.jpg') === true || endsWith(commentLink, '.png') === true || endsWith(commentLink, '.gif') === true
         && endsWith(commentLink, 'l.jpg') === false && endsWith(commentLink, 'l.png') === false && endsWith(commentLink, 'l.gif') === false)
        {
          images.push(commentLink.replace('.jpg', 'l.jpg')); // l makes it a 'large thumbnail (imgur api)'
        } else if (commentLink.toLowerCase().indexOf("imgur.com") >= 0 // if url is an imgur link
         && commentLink.toLowerCase().indexOf("imgur.com/a/") <= 0 // and it's not an album
         && commentLink.toLowerCase().indexOf("imgur.com/gallery") <= 0 // or a gallery
         && commentLink.toLowerCase().indexOf(",") <= 0 // or has a comma in it
         && endsWith(commentLink, '.jpg') === false && endsWith(commentLink, '.png') === false && endsWith(commentLink, '.gif') === false) // or already ends with .jpg or .png or .gif) 
        {
          images.push(commentLink += 'l.jpg'); 
        }  else {
          images.push(commentLink); 
        }
      }

      for (var i = 0; i < images.length; i++) {
        var source;
        if (images[i].toLowerCase().indexOf("imgur.com") >= 0) {
          source = images[i].replace('l.jpg', '.jpg');
        } else {
          source = images[i];
        }

        var imageTemplate = '<div class="card">' +
                              '<a href="' + source + '" class="img-link fancybox" rel="group">' +
                                '<img src=' + images[i] + '>' +
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
      $(function(){ // remove cards whose images are duplicates
        var srcs = [],
          temp;
        $('.card img').filter(function(){
          temp = $(this).attr("src");
          if($.inArray(temp, srcs) < 0) {
              srcs.push(temp);   
              return false;
          }
          return true;
        }).closest('.card').remove();
      });
      $('img').error(function() {
        var viewOnTemplate = '<a class="view-on" target="_blank" href=' + $(this).attr("src").replace('l.jpg', '.jpg') + '><p><span>thumbnail unavailable</span>';
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
  }
}

request();
masonryInit();

$.ajaxSetup({ // loading spinner
    beforeSend:function(){
      $("#loading").addClass('show');
    },
    complete:function(){
      $container.imagesLoaded().always(function(){
        $("#loading").removeClass('show');
      });
    }
});