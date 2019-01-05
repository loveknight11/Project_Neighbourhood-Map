var map;
var mainInfoWindow;
var tempInfoWindow;

// intialization of map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.016337, lng: 31.208355},
    zoom: 17
  });
  mainInfoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  // add markers from model to map
  for (var i = 0; i < model.length; i++) {
    var position = model[i].location;
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: model[i].name,
      animation: google.maps.Animation.DROP,
      image: model[i].image
    });
    // add the marker to markers array
    markers.push(marker);
    //add marker to model
    myViewModel.locations()[i].marker = marker;
    
    // click listener for the marker to show info window
    marker.addListener('click', function() {
      animateMarker(this);
      populateInfoWindow(this, mainInfoWindow);
    });
    // set map bounds to include marker
    bounds.extend(marker.position);
  }
  // extend map to view all markers
  map.fitBounds(bounds);
}

// function to handle error on map load
function googleError() {
    alert("Failed to intialize Google Maps, check your connection and try again");
}
// function to populate info window 
function populateInfoWindow(marker, infoWindow) {
  // Check if the infoWindow is not opened
  if (infoWindow.marker != marker) {
    // Clear the infoWindow
    infoWindow.setContent('');
    infoWindow.marker = marker;

    // Clear marker when infoWindow is closed
    infoWindow.addListener('closeclick', function() {
      infoWindow.marker = null;
    });

  // load inforamtion from wikipedia
    var  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    $.ajax(wikiURL,{
      dataType: "jsonp",
      data: {
        async: true
      }
    }).done(function(response) {
      //url for the page on wikipedia
      var address = response[3][0];
      // description from wikipedia
      var article = response[2][0];
      // check if wikipedia gets url for the page and populate infoWindow accordingly
      if (!address) {
        infoWindow.setContent('<div>' +
        '<h3>' + marker.title + '</h3>' + 
        '</div><br><p>No info in wikipedia</p><hr><img src="' + marker.image + '">');
      } else {
        infoWindow.setContent('<div>' +
        '<h3>' + marker.title + '</h3>' + '</div><br><a href ="' + address + '">' + address + '</a><p>' + article + '</p><hr><img src="' + marker.image + '">');
      }
      // Open the infowindow
      infoWindow.open(map, marker);
      // if the request to wikipedia fails populate infoWindow letting the user know
    }).fail(function(jqXHR, textStatus) {
      infoWindow.setContent('<div>' +
        '<h3>' + marker.title + '</h3>' + 
        '</div><br><p>cannot connect to wikipedia now.</p><hr><img src="' + marker.image + '">');
      // Open the infowindow
        infoWindow.open(map, marker);
    });

  }

}

// Bounce the marker
function animateMarker(marker) {
  if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      stopAnimation(marker);
    }
}

// Marker stop Bounce after 5 seconds
function stopAnimation(marker) {
    setTimeout(function() {
        marker.setAnimation(null);
    }, 5000);
}