// Store API endpoint as queryUrl.
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a title layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribute: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '
}).addTo(myMap);

// Perform a GET request to the query URL/ and defined functions
d3.json(queryUrl).then(function (data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function mapColor(depth) {
        switch(true) {
            case depth > 90:
                return "#011f4b";
            case depth > 70:
                return "#03396c";
            case depth > 50:
                return  "#005b96";
            case depth > 30:
                return "#6497b1";
            case depth > 10:
                return "#b3cde0";
            default:
                return "#92d2f9";
        }
    };

    function mapRadius(mag) {
        if(mag === 0) {
            return 1;
        }

        return mag * 4;
    }

    L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,

        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

    // creating legends
    let legend = L.control({position: "bottonright"});
    legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
    depth = [-10,10,30,50,70,90];

    for(var i=0; i< depth.length; i++) {
        div.innerHTML += '<i style="background: ' + mapColor(depth[i] + 1) + '"></i>' + depth[i] + (depth[i+1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
    };
    legend.addTo(myMap)

});


