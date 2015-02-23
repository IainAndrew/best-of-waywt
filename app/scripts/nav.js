var $nav = $('nav'),
    offset = $nav.offset().top;
$(window).on('scroll', function() {
  if ($(this).scrollTop() > offset) {
    $nav.addClass('sticky');
    $('h1').css({
      'margin-bottom': $nav.outerHeight()
    });
  } else {
    $nav.removeClass('sticky');
    $('h1').css({
      'margin-bottom': 0
    });
  }
});