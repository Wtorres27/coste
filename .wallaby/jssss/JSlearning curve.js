// when page loads request user location
window.onload = async () => {
  // store array of coordinates to use
  let coordinates = await getUserCoordinates();
  myMap.coordinates = coordinates;
  // get users locationto create map
  myMap.createMap(coordinates);
};

// function to use user location to create map
async function getUserCoordinates() {
  let position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return [position.coords.latitude, position.coords.longitude];
}

// create Map Object
const myMap = {
  // create properties
  createMap: function (coordinates) {
    // Create Map & tile layer
    const map = L.map("map", {
      center: coordinates,
      zoom: 13,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Create Marker
    const marker = L.marker(coordinates);
    marker.addTo(map).bindPopup("<p1><b>You Are Here</b></p1>").openPopup();
    // assigning map to a property to use outside of the function
    myMap.map = map;
  },
  // use foursquare data to create markers
  addMarkers: function () {
    // using for loop to create markers
    for (let i = 0; i < 5; i++) {
      // create markers using myMap.markers property to reference the data in the array of parsedData
      L.marker([myMap.markers[i][0].latitude, myMap.markers[i][0].longitude])
        .bindPopup(`${myMap.markers[i][1]}`)
        .addTo(myMap.map);
    }
  },
};
// installing foursquare
let options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: "fsq3u2r7tzpeO74swAQgOLUNmIqKuYtOuF9N2BaQYRP3FRE=",
  },
};
// used fetch() to get data
async function fetchPlaces(business) {
  let response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=5&ll=${myMap.coordinates}`,
    options
  );
  let places = await response.json();
  return places.results;
}
// // added parseLocations() to parse location
function parseLocations(results) {
  let locations = [];
  results.forEach((result) => {
    let location = [result.geocodes.main, result.name];
    locations.push(location);
  });
  return locations;
}
// added click event listener to button
document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();
  submitButton();
});
// configured submitbutton() to get user input and call submitButton to fetch locations from foursquare
async function submitButton() {
  let selection = document.getElementById("business").value;
  let fourSquareData = await fetchPlaces(selection);
  let parsedData = parseLocations(fourSquareData);
  // store parsed data in myMap.markers array to add to map
  myMap.markers = parsedData;
  myMap.addMarkers();
}
