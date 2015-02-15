var endings = ['','&after=t3_2vznaw', '&after=t3_2vzv1p', '&after=t3_2vwlt9', '&after=t3_2vx1mr'];
var result = [];
for (var i = 0; i < endings.length; i++) {
  $.getJSON('http://www.reddit.com/r/malefashionadvice.json?jsonp=?&limit=100' + endings[i], function(data) {
    for (var i = 0; i <= data.data.children.length - 1; i++) {
      if ( data.data.children[i].data.title.indexOf("WAYWT - ") > -1 ) {
        result.push(data.data.children[i].data.url + '.json?jsonp=?&sort=top');
      }
    }
    //console.log(result);
    $.getJSON(result, function(data) {
      for (var i = 0; i <= 10; i++) {
        console.log(data[1].data.children[i].data.body_html);
      }
    });
  });
}
