// array to hold markers data
var markers = [];

// model data for locations
var model = [
{
	name: 'sphinx',
	cat: 'Tourism',
	image: 'img/sphinx.jpg',
	location: {
		lat: 29.975266, 
		lng: 31.137616
	}
}, {
	name: 'Giza Pyramids',
	cat: 'Tourism',
	image: 'img/pyramids.jpg',
	location: {
		lat: 29.977282, 
		lng: 31.132505
	}
}, {
	name: 'Egyptian Media Production City',
	cat: 'Media',
	image: 'img/production.jpg',
	location: {
		lat: 29.965746, 
		lng: 31.016253
	}
}, {
	name: 'Egyptian Museum',
	cat: 'Tourism',
	image: 'img/museum.jpg',
	location: {
		lat: 30.047852, 
		lng: 31.233644
	}
}, {
	name: 'Citadel of Salah Ed-Din',
	cat: 'Tourism',
	image: 'img/citadel.jpg',
	location: {
		lat: 30.029896, 
		lng: 31.261076
	}
}, {
	name: 'Ain Shams University',
	cat: 'University',
	image: 'img/ainshams.jpg',
	location: {
		lat: 30.075831, 
		lng: 31.281098
	}
}, {
	name: 'Al-Hussein Mosque',
	cat: 'Masjed',
	image: 'img/hussien.jpg',
	location: {
		lat: 30.047816, 
		lng: 31.263181
	}
}, {
	name: 'Cairo Tower',
	cat: 'Tourism',
	image: 'img/tower.jpg',
	location: {
		lat: 30.045928, 
		lng: 31.224294
	}
}, {
	name: 'Egypt Dream Park',
	cat: 'Park',
	image: 'img/dream.jpg',
	location: {
		lat: 29.967202, 
		lng: 31.059241
	}
}, {
	name: 'Cairo International Airport',
	cat: 'Airport',
	image: 'img/airport.jpg',
	location: {
		lat: 30.112695, 
		lng: 31.399855
	}
}, {
	name: 'Carrefour Market',
	cat: 'Mall',
	image: 'img/carfor.jpg',
	location: {
		lat: 29.982621, 
		lng: 31.316222
	}
}
]

// location object
var loc = function(data) {
	this.name = data.name;
	this.cat = data.cat;
	this.location = data.location;
	this.image = data.image;
};

// VM 
var viewModel = function() {
	var self = this;
	//intialize observable array to keep all the locations
	this.locations = ko.observableArray();
	//add model data in the locations array
	model.forEach(function(locData) {
		self.locations.push(new loc(locData))
	});
	// variable for user input to filter list and markers
	this.userInput = ko.observable();
	// variable for selected location
	this.currentLocation = ko.observable();
	// set selected location as current location
	this.setCurrentLocation = function(selectedLocation) {
		self.currentLocation(selectedLocation);
		// populate infoWindow for the selected location marker
		populateInfoWindow(selectedLocation.marker, mainInfoWindow);
		// animate marker of the selected location
		animateMarker(selectedLocation.marker);

	};

	// filter function for the list and markers
	self.filteredLocations = ko.computed(function() {
		// close info window if there is one
		if (mainInfoWindow) {
			mainInfoWindow.close();
		}
		// check to see if the user entered any text to filter
	  var filter = (self.userInput() ? self.userInput().toLowerCase() : '');
	  // sort the list
	  return ko.utils.arrayFilter(self.locations(), function(loc) {
	  	// check the user input to see if it is empty
		  if (!self.userInput()) {
			  // show all markers if they were previously hidden
			  if (loc.marker) {
			  	loc.marker.setVisible(true);
			  }
		  	  return self.locations();
			  // if the input is not empty filter markers and show only
			  // markers of filtered locations
		  }else if (loc.name.toLowerCase().indexOf(filter) !== -1) {
				loc.marker.setVisible(true);
				return true;
			}else{
				loc.marker.setVisible(false);
			}
	  	});
	  }, this);

}
// apply bindings
var myViewModel = new viewModel();
ko.applyBindings(myViewModel);