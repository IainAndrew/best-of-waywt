$(window).on('scroll', function() {
  var $nav = $('nav'),
      origPos = $nav.offset().top,
      scrollTop = origPos - $(this).scrollTop();
  if (scrollTop <= 0) {
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