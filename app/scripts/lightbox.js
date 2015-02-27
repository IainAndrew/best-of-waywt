var $lightbox = $('#lightbox'),
    $overlay = $('#overlay'),
    $lightboxImage = $('#lightbox-image');

$container.on('click', '.img-link', function(e) {
  e.preventDefault();
  $lightbox.addClass('show');
  $overlay.addClass('show');
  if ($(this).find('img').attr('src').toLowerCase().indexOf("imgur.com") >= 0) {
    $lightbox.find($lightboxImage).append( '<img src=' + $(this).find('img').attr('src').replace('l.jpg', '.jpg') + '>' );
  } else {
    $lightbox.find($lightboxImage).append( '<img src=' + $(this).find('img').attr('src') + '>' );
  }
});
$lightbox.find('a').add($overlay).on('click', function(e) {
  e.preventDefault();
  $lightbox.removeClass('show');
  $overlay.removeClass('show');
  $lightboxImage.empty();
});

//if ($lightboxImage.find('img'))