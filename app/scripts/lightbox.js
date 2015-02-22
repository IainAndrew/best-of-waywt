var $images = $('#images'),
    $lightbox = $('#lightbox'),
    $overlay = $('#overlay'),
    $lightboxImage = $('#lightbox-image');

$images.on('click', '.img-link', function(e) {
  e.preventDefault();
  $lightbox.addClass('show').find('#lightbox-image').append( '<img src=' + $(this).find('img').attr('src').replace('//res.cloudinary.com/duj6igl8q/image/fetch/w_300/', '') + '>' );
  $overlay.addClass('show');
});
$lightbox.find('a').add($overlay).on('click', function(e) {
  e.preventDefault();
  $lightbox.removeClass('show');
  $overlay.removeClass('show');
  $lightboxImage.empty();
});