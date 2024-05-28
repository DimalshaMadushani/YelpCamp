// const campground = require("../../models/campground");

  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center:campground.geometry.coordinates, //[-122.330284,47.603245], // starting position [lng, lat]
    zoom: 9, // starting zoom
  });
 

// create the popup
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
`<h5>${campground.title}</h5><p>${campground.location}</p>`)

// Create a default Marker and add it to the map.
new mapboxgl.Marker({color: "red"})
.setLngLat(campground.geometry.coordinates)
.setPopup(popup)
.addTo(map);

  