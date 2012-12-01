function getParameterByName(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if(results == null)
    return undefined;
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function success(position) {
  calculateCider(position.coords.latitude, position.coords.longitude);
}

function calculateCider(lat, lng) {
  var geonames = new GeoNames();

  geonames.findNearByWeather(lat, lng, function(data) {
    if (data) {
      if (parseInt(data.temperature) >= 30) {
        $('#outcome').html("DAMN it's warm! Cider is the only option I'm afraid");
        $('body').addClass('cider');
      } else if (parseInt(data.temperature) >= 19) {
        $('#outcome').html("it's a bit warm, so best have a cider");
        $('body').addClass('cider');
      } else if (parseInt(data.temperature) >= 12) {
        $('#outcome').html("maybe go a glass of red");
        $('body').addClass('wine');
      } else {
        // it's xmas, so it's all about the mulled wine!
        $('#outcome').html("of course it is, it's xmas ffs!");
        $('body').addClass('mulled-wine');
      }
      $('#status').html('currently ' + data.temperature + '&deg; in <a href="/?lat=' + data.lat + '&lng=' + data.lng + '">' + data.stationName + '</a>');
    } else {
      $('#status').html('failed to get weather details');
      $('body').addClass('error');
    }
  });
}

function error(message) {
  msg = typeof message == 'string' ? message : "failed";
  $('#status').html(msg);
  $('body').addClass('error');
} 

var today = new Date();
var hour = today.getHours();
var lat = getParameterByName('lat');
var lng = getParameterByName('lng');
var free = getParameterByName('isitfreecider');

if (typeof free != "undefined" && free !== null && free === "yes") {
  $('#outcome').html("JACKPOT! DRINK ALL OF THE CIDER!");
  $('#status').html("don't forget to high five");
  $('body').addClass('cider');
} else if ((typeof lat != "undefined" && lat !== null) && (typeof lng != "undefined" && lng !== null)) {
  $('#status').html("calculating based on lat and lng ...");
  calculateCider(lat, lng);
} else if (hour < 9) {
  $('#outcome').html("it's before 9, ciroc?");
  $('#status').html("(or sleep)");
  $('body').addClass('ciroc');
} else if (hour >= 9 && hour < 11) {
  $('#outcome').html("check in at 11, liver break!");
  $('#status').html("drink responsibly&#8482;");
  $('body').addClass('liver');
} else if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  error('not supported');
}
