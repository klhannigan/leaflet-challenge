let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url).then(data => {
    console.log(data);

    createFeatures(data.features);
});

function createFeatures(earthquake) {

  function featuresLayer(features, layer){
    layer.bindPopup(`<h3>${features.properties.place}</h3><hr>
    <p>${new Date(features.properties.time)}</p>`);};

    let earthquakes = L.geoJSON(earthquake, {
        featuresLayer: featuresLayer,
        pointToLayer: function(features, coordinates) {
        let depth = features.properties.mag;
        let geoMarkers = {
            radius: depth * 5,
            fillColor: colors(depth),
            fillOpacity: 0.8,
            weight: 0.6
        };
        return L.circleMarker(coordinates, geoMarkers);
    }
    });

  createMap(earthquakes);
};

function colors(depth) {
    let color = "";

    if (depth <= 1) {
        return color = "#5bf5e5";
    }
    else if (depth <= 2) {
        return color = "#5bf56d"
    }
    else if (depth <= 3) {
        return color = "#f0f55b";
    }
    else if (depth <= 4) {
        return color = "#f59d5b";
    }
    else if (depth <= 5) {
        return color = "#f55b5b";
    }
    else {
        return color = "#fc0000";
    }
};

function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?',{layers: 'TOPO-WMS'});

    let grayscale = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 20,
        subdomains: 'abcd',
        accessToken: 'YnpQEhRDopnhG3NFNlYUwXCpK50fR3yagyHj5MwZJKWU0gnuq4iYH7xJ49UjNWaC'
    });

    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo,
        "Grayscale Map": grayscale
    };

    let overlayMaps = {
        Earthquakes: earthquakes
    };

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
    }).addTo(myMap);

    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {

    let div = L.DomUtil.create("div", "info legend");
    let depthIntervals = [0, 1, 2, 3, 4, 5];
    let colors = ["#5bf5e5", "#5bf56d", "#f0f55b", "#f59d5b", "#f55b5b", "#fc0000"];
  
    for (let i = 0; i < depthIntervals.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            depthIntervals[i] + (depthIntervals[i + 1] ? "&ndash;" + depthIntervals[i + 1] + "<br>" : "+");
    }
    
    return div;

    
};

legend.addTo(myMap);

}
