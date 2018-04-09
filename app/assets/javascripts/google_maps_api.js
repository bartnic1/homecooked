

let geocoder;
let map;
let yourMarker
let postingMarkers = []
let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let labelIndex = 0


function codeAddress(address, callback) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      callback(results)
    } else {
      console.log('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function initialize() {
  geocoder = new google.maps.Geocoder();
  // let userPlace = document.getElementById('googleMap').dataset.userLocation
  // console.log(codeAddress(userPlace , (geoObject) => {console.log(geoObject}))
  // let userLongitude = (43.646517, -79.395197)
  // let userLatitude =

  let latlng = new google.maps.LatLng(43.646517, -79.395197);
  let mapOptions = {
    zoom: 15,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
  yourMarker = new google.maps.Marker({
    map: map,
    position: latlng
  });
  mealPostingMarkers()
}


function orderMarkerByProximity() {
  labelIndex = 0
  postingMarkers.sort(function(a, b){
    let aLat = a.position.lat()
    let aLng = a.position.lng()
    let bLat = b.position.lat()
    let bLng = b.position.lng()
    let mLat = yourMarker.position.lat()
    let mLng = yourMarker.position.lng()

    let aDistance = Math.sqrt(Math.pow((aLat - mLat), 2) + Math.pow((aLng - mLng), 2))
    let bDistance = Math.sqrt(Math.pow((bLat - mLat), 2) + Math.pow((bLng - mLng), 2))
    return (aDistance - bDistance)
  })

  for (let marker of postingMarkers) {
    marker.label = labels[labelIndex++ % labels.length]
    marker.setMap(map)
  }

}

function mealPostingMarkers() {

  function mealMarkerCallback (geoObject) {
    function checkLocation(postings) {
      if (geoCount === 0) { return false }
      return (geoObject[0].formatted_address === postings.address)
    }

    if(!postingMarkers.find(checkLocation)){
      let marker = new google.maps.Marker({
        map: map,
        position: geoObject[0].geometry.location,
        label: labels[labelIndex++ % labels.length],
        address: geoObject[0].formatted_address
      })
      postingMarkers.push(marker)

      orderMarkerByProximity()
    }
  }

  postingMarkers.length = 0

  let geoCount = 0
  for (let element of document.getElementsByClassName("meal-div")) {
    let address = element.dataset.address
    geoCount++
    if ((geoCount % 9) === 0) {
          setTimeout(function() {codeAddress(address, mealMarkerCallback)}, 1300);
    } else {
      codeAddress(address, mealMarkerCallback)
    }


  }

}


function moveYourLocation() {
  let address = document.getElementById('address').value;
  codeAddress(address, function(geoObject){
    map.setCenter(geoObject[0].geometry.location)
  })
  codeAddress(address, function (geoObject) {
    if (yourMarker){
     yourMarker.setMap(null)
    }
    yourMarker = new google.maps.Marker({
      map: map,
      title: "Your Location!",
      position: geoObject[0].geometry.location
    });

  })

}

