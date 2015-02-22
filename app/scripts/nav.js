$(window).on('scroll', function() {
  var $nav = $('nav'),
      scrollTop = $nav.offset().top - $(this).scrollTop();
  console.log(scrollTop);
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