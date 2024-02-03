# Earthquake Visualization with Leaflet

This project utilizes Leaflet, D3, and jQuery to create an interactive map visualization of earthquake data. The earthquakes are represented as markers on the map, where their size corresponds to magnitude, and the color reflects the depth.

## Features
* TileLayer: The base map layer loads without errors using Leaflet TileLayer.

* GeoJSON API: The application connects to the USGS GeoJSON API to fetch earthquake data.

* Marker Size: Markers on the map dynamically change size based on earthquake magnitude.

* Legend: A legend is displayed in the bottom-right corner, providing information about depth and color representation.

* Data Points: Earthquake data points scale with magnitude level, change colors with depth level, and display tooltips with information about magnitude, location, and depth.

## Visualization Layers
* Streetmap Layer: Displays earthquake markers on a street map, with colors representing depth.

* Cluster Layer: Utilizes Leaflet.markercluster to group nearby earthquake markers for improved readability.

* Heatmap Layer: Incorporates Leaflet.heat to visualize earthquake density as a heatmap.

## Dependencies
Leaflet v1.9.4
Leaflet.markercluster v1.5.0
Leaflet.heat v0.2.0
jQuery v3.6.0
D3 v7

## Credits
This project uses earthquake data provided by the USGS (United States Geological Survey).


## Note 
Some parts of the code is created with the help of chatGPT 

* The below section from logic.js

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

* The following section of index.html
<body>
<!-- Leaflet.markercluster JS -->
  <script src="https://unpkg.com/leaflet.markercluster@1.5.0/dist/leaflet.markercluster.js"></script>

  <!-- Leaflet.heat JS -->
  <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>

  </body>
