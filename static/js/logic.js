var myMap = L.map("mapid", {
  center: [50, -100],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
function depth(x) {
  return x > 90 ? "#9f1d18" :
    x > 70 ? "#e1423c" :
      x > 50 ? "#de7a26" :
        x > 30 ? "#dea826" :
          x > 10 ? "#dec726" :
            "#99de26";
}

d3.json(queryUrl, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h2>" + feature.properties.place + "</h2>");

    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 4,
        fillColor: depth(feature.geometry.coordinates[2]),
        color: "#040401",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }

  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    grades = [0, 1, 2, 3, 4, 5],
      labels = [];

    for (var i = 0; i < grades.length; i++) {

      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  // Adding legend to the map
  legend.addTo(myMap);

});

function getColor(depth) {
  return depth > 5 ? "#9f1d18" :
    depth > 4 ? "#e1423c" :
      depth > 3 ? "#de7a26" :
        depth > 2 ? "#dea826" :
          depth > 1 ? "#dec726" :
            "#99de26";

};
// Adding legend to the map
legend.addTo(myMap);
