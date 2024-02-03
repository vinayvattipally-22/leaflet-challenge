// Function to determine marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 3;
}


// Function to determine marker color based on depth
function getMarkerColor(depth) {
    return depth > 90 ? '#FF4500' :  // Dark Orange
           depth > 70 ? '#FF8C00' :  // Orange
           depth > 50 ? '#FFD700' :  // Gold
           depth > 30 ? '#FFFF00' :  // Yellow
                        '#00FF00';  // Green
}

// Function to create a legend
function createLegend() {
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [-10, 10, 30, 50, 70, 90];
        var labels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];

        // Add color scale beside the legend vertically
        for (var i = 0; i < depths.length; i++) {
            if (i !== depths.length - 1) {
                div.innerHTML +=
                    '<div style="background:' + getMarkerColor(depths[i] + 1) + '; height: 20px; width: 20px; display:inline-block; margin-right: 5px;"></div> ' +
                    '<span style="margin-bottom: 5px;">' + labels[i] + '</span><br>';
            } else {
                div.innerHTML +=
                    '<div style="background:' + getMarkerColor(depths[i]) + '; height: 20px; width: 20px; display:inline-block; margin-right: 5px;"></div> ' +
                    '<span style="margin-bottom: 5px;">' + labels[i] + '</span><br>';
            }
        }

        return div;
    };

    legend.addTo(map);
}

// Other functions and map initialization...


// Initialize the map
var map = L.map('map', {
    layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        })
    ]
}).setView([0, 0], 2);

// Base map layers
var streetmapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Cluster layer
var markers = L.markerClusterGroup().addTo(map);

// Heatmap layer
var heatData = [];

// Fetch and plot earthquake data
$.getJSON('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', function (data) {
    createLegend();

    // Streetmap layer
    var streetmap = L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
            var markerOptions = {
                radius: getMarkerSize(feature.properties.mag),
                fillColor: getMarkerColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            return L.circleMarker(latlng, markerOptions);
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>Location:</b> ' + feature.properties.place +
                            '<br><b>Magnitude:</b> ' + feature.properties.mag +
                            '<br><b>Depth:</b> ' + feature.geometry.coordinates[2] + ' km');
        }
    }).addTo(map);

    // Cluster layer
    data.features.forEach(function (feature) {
        var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
        marker.bindPopup('<b>Location:</b> ' + feature.properties.place +
                        '<br><b>Magnitude:</b> ' + feature.properties.mag +
                        '<br><b>Depth:</b> ' + feature.geometry.coordinates[2] + ' km');
        markers.addLayer(marker);

        heatData.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
    });

    // Heatmap layer
    var heatmap = L.heatLayer(heatData, { radius: 20, blur: 15 });

    // Layer control
    var baseMaps = {
        'Streetmap': streetmapLayer,
    };

    var overlayMaps = {
        'Streetmap': streetmap,
        'Cluster': markers,
        'Heatmap': heatmap
    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);
});
