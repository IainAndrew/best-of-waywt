var $lightbox = $('#lightbox'),
    $overlay = $('#overlay'),
    $lightboxImage = $('#lightbox-image');

$container.on('click', '.img-link', function(e) {
  e.preventDefault();
  $lightbox.addClass('show').find('#lightbox-image').append( '<img src=' + $(this).find('img').attr('src').replace('l.jpg', '.jpg') + '>' );
  $overlay.addClass('show');
});
$lightbox.find('a').add($overlay).on('click', function(e) {
  e.preventDefault();
  $lightbox.removeClass('show');
  $overlay.removeClass('show');
  $lightboxImage.empty();
});