// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition, showError);
//     } else {
//         var x = document.getElementById("location");
//         x.innerHTML = "Geolocation is not supported by this browser.";
//     }
// }
// function showError(error) {
//     switch (error.code) {
//         case error.PERMISSION_DENIED:
//             x.innerHTML = "User denied the request for Geolocation."
//             break;
//         case error.POSITION_UNAVAILABLE:
//             x.innerHTML = "Location information is unavailable."
//             break;
//         case error.TIMEOUT:
//             x.innerHTML = "The request to get user location timed out."
//             break;
//         case error.UNKNOWN_ERROR:
//             x.innerHTML = "An unknown error occurred."
//             break;
//     }
// }

var geocoder;
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 }
    });
    geocoder = new google.maps.Geocoder();
}

document.getElementById('submit').addEventListener('click', function () {
    geocodeAddress(geocoder, map);
});


function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({ 'address': address }, function (results, status) {

        if (status === 'OK') {
            // console.log(results[0])
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
            // console.log(results[0].geometry.location.lat());

            showPosition(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function showPosition(position) {
    // var x = document.getElementById("location");
    // x.innerHTML = "Latitude: " + position.lat() +
    //     "<br>Longitude: " + position.lng();
    var latlon = position.lat() + "," + position.lng();


    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=ihFJccSowVqXXUsbu3CQf4vL56tgEJMA&latlong=" + latlon,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log("response: ", json);
            // var e = document.getElementById("events");
            // e.innerHTML = json.page.totalElements + " events found.";
            showEvents(json);
            // initMap(position, json);
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });

}



function showEvents(json) {
    for (var i = 0; i < json.page.size; i++) {
        var imageUrl = json._embedded.events[i].images[2].url;
        console.log(image)
        var image = $('<img>').attr("src", imageUrl)
        $("#events").append(image, "<p>" + json._embedded.events[i].name + "</p>");
        addMarker(map, json._embedded.events[i]);
    }
}

function addMarker(map, event) {
    // console.log(event);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
        map: map
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    //     console.log(marker);
}




// getLocation();