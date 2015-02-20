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
  $('#images').masonry().masonry('destroy').imagesLoaded(function() {
    $('#images').masonry({
      itemSelector: '.card',
      isAnimated: true
    });
  });
}

function request() {
  $('#images').empty();
  if (isNaN(counter)) {
    counter = 0;
  }
  $.getJSON('http://www.reddit.com/r/malefashionadvice/search.json?q=selftext:WAYWT = What Are You Wearing Today&syntax=lucene&restrict_sr=true&sort=new', function(response) {
    var thread = response.data.children[counter].data,
        $heading = $('#heading');

    $heading.html(thread.title);
    history.pushState('', '', '#' + counter + '/' + thread.title.toLowerCase().slice(7).replace(/\s/g, '').replace('.','-'));

    $.getJSON(thread.url + '.json?jsonp=?&sort=top', function(response) {
      var comments = response[1].data.children;
      var images = [];

      for (var i = 0; i < comments.length - 1; i++) {
        var match = comments[i].data.body_html.match(/a href="([^"]*)/); // extract urls from comments

        if (match) { // makes sure no urls are null so it doesn't break
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
        // } else if (endsWith(commentLink, '.jpg') === true || endsWith(commentLink, '.png') === true || endsWith(commentLink, '.gif') === true) {
        //   images.push(commentLink); 
        } else {
          images.push(commentLink); 
        }
      }

      for (var i = 0; i < images.length; i ++) {
        // if (endsWith(images[i], '.jpg') === false && endsWith(images[i], '.png') === false && endsWith(images[i], '.gif') === false) {
        //   console.log(images.splice(images.indexOf(i)));
        // }
        var imageTemplate = '<div class="card">' +
                              '<a href="#" class="img-link">' +
                                '<img src=' + '//res.cloudinary.com/duj6igl8q/image/fetch/w_300/' + images[i] + '>' +
                              '</a>' +
                              '<span>' + comments[i].data.author + '</span>' +
                              '<span>' + comments[i].data.score + ' points</span>' +
                              '<a href=' + '//reddit.com' + thread.permalink + comments[i].data.id + ' target="_blank">View on Reddit</a>' +
                            '</div>';
        // append images to the container and reinitialise masonry
        $('#images').append(imageTemplate)
                    .masonry().masonry('destroy').imagesLoaded(function(){
                      $('#images').masonry().masonry('reloadItems');
        });
        // $('img').error(function() {
        //   if ( ($(this).attr('src').indexOf('drsd.so') > -1) || ($(this).attr('src').indexOf('dressed.so') > -1) ) {
        //     $(this).unbind('error').closest('.img-link').replaceWith('<a class="view-on" target="_blank" href=' + $(this).attr("src").replace('//res.cloudinary.com/duj6igl8q/image/fetch/w_300/', '') + '>thumbnail unavailable - view on dressed.so</a>');
        //   } else if ( ($(this).attr('src').indexOf('imgur.com') > -1) ) {
        //     $(this).unbind('error').closest('.img-link').replaceWith('<a class="view-on" target="_blank" href=' + $(this).attr("src").replace('//res.cloudinary.com/duj6igl8q/image/fetch/w_300/', '') + '>thumbnail unavailable - view album on imgur</a>');
        //   } else if ( ($(this).attr('src').indexOf('reddit.com') > -1) ) {
        //     $(this).unbind('error').closest('.card').remove();
        //   }
        //   masonryInit();
        // });
      }
      $('img').error(function() {
        if ( ($(this).attr('src').indexOf('drsd.so') > -1) || ($(this).attr('src').indexOf('dressed.so') > -1) ) {
          $(this).unbind('error').closest('.img-link').replaceWith('<a class="view-on" target="_blank" href=' + $(this).attr("src").replace('//res.cloudinary.com/duj6igl8q/image/fetch/w_300/', '') + '>thumbnail unavailable - view on dressed.so</a>');
        } else if ( ($(this).attr('src').indexOf('imgur.com') > -1) ) {
          $(this).unbind('error').closest('.img-link').replaceWith('<a class="view-on" target="_blank" href=' + $(this).attr("src").replace('//res.cloudinary.com/duj6igl8q/image/fetch/w_300/', '') + '>thumbnail unavailable - view album on imgur</a>');
        } else if ( ($(this).attr('src').indexOf('reddit.com') > -1) ) {
          $(this).unbind('error').closest('.card').remove();
        }
        masonryInit();
      });

    });
  });
}

$('#images').on('click', '.img-link', function(e) {
  e.preventDefault();
  $('#lightbox').addClass('show').find('#lightbox-image').append( '<img src=' + $(this).find('img').attr('src').replace('//res.cloudinary.com/duj6igl8q/image/fetch/w_300/', '') + '>' );
  $('#overlay').addClass('show');
});
$('#lightbox a').add($('#overlay')).on('click', function(e) {
  e.preventDefault();
  $('#lightbox').removeClass('show');
  $('#overlay').removeClass('show');
  $('#lightbox-image').empty();
});

request();
masonryInit();