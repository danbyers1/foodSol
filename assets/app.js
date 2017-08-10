//FIREBASE DATABASE TRACKING CLICK COUNTS

var config = {
    apiKey: "AIzaSyAiWnUAVnuiqk0L5wrpbkWLaE4kJg1Vn5M",
    authDomain: "foodsol-project.firebaseapp.com",
    databaseURL: "https://foodsol-project.firebaseio.com",
    projectId: "foodsol-project",
    storageBucket: "foodsol-project.appspot.com",
    messagingSenderId: "438363699225"
  };
  firebase.initializeApp(config);
// Variables
    // ================================================================================
    // Get a reference to the database service
    var database = firebase.database();
    // Initializing our click count at 0
    var clickCounter = 0;
    // Functions
    // ================================================================================
    // On Click
    $("#submit").on("click", function() {
      // Add 1 to clickCounter
      clickCounter++;
      // **** Store Click Data to Firebase in a JSON property called clickCount *****
      // **** Note how we are using the Firebase .set() method ****
      // **** .ref() refers to the path you want to save your data to
      // **** Since we left .ref() blank, it will save to the root directory
      database.ref().set({
        clickCount: clickCounter
      });
      // Now! go to https://fir-click-counter-7cdb9.firebaseio.com/ to see the impact to the DB
    });

//GLOBAL Variables
//=================================================================================

    var latitude = "";
    var logitude = "";
   
//MAIN FUNCTION
//==================================================================================

$('#submit').on('click',function(){
   $("#enterPanel").empty();

///var x=$(this).data("search");
//  console.log(x);


//GOOGLE DETAILS
//=================================================================================
   
    // Here we are building the URL we need to query the database
    var address = document.getElementById('address').value;
   
    var CuisList = document.getElementById('dropdown').value;

    var queryURLGoo = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCBXtlBMYT0RJd-PEUp5B82C34_X6bMdf4";

  // We then created an AJAX call
    $.ajax({
      url: queryURLGoo,
      method: "GET"
     // headers: { "user-key": APIKey}
    }).done(function(response) {
      console.log(queryURLGoo);
      latitude = response.results[0].geometry.location.lat;
      logitude = response.results[0].geometry.location.lng;
    
    //Display the Google Map
  

//ZOMATO DETAILS
//=================================================================================E

    var APIKey = "475c3fccef084c21f7295addd8a398be";
    
   // Here we are building the URL we need to query the database
    var queryURL = "https://developers.zomato.com/api/v2.1/search?count=40&lat="+latitude+"&lon="+ logitude+"&radius=16093"+"&api-key=475c3fccef084c21f7295addd8a398be"
    // We then created an AJAX call
      console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET",
      headers: { "user-key": APIKey}
    }).done(function(response) {
      for(var i = 0; i < response.restaurants.length; i++) {
        if(response.restaurants[i].restaurant.cuisines.includes(CuisList)){
          var enterPanel = $("<div>");
          enterPanel.addClass("btn btn-warning");
          enterPanel.attr("id", "resWell-" +i);
          $("#enterPanel").append(enterPanel);

          $("#resWell-" +i).append("<strong>Restaurant: </strong>" + response.restaurants[i].restaurant.name +"<br>");
          $("#resWell-" +i).append("<strong>Address: </strong>" + response.restaurants[i].restaurant.location.address +"<br>");
          
            if(response.restaurants[i].restaurant.average_cost_for_two){

          $("#resWell-" +i).append("<strong>Foodies Date Cost: </strong>" + response.restaurants[i].restaurant.average_cost_for_two +"<br>");
         }
          $("#resWell-" +i).append("<strong>Cuisines: </strong>" + response.restaurants[i].restaurant.cuisines +"<br>");
          
          if(response.restaurants[i].restaurant.phone_numbers){
           $("#resWell-" +i).append("<strong>Phone Number: </strong>" + response.restaurants[i].restaurant.phone_numbers +"<br>");
          }
          if(response.restaurants[i].restaurant.user_rating.aggregate_rating){
           $("#resWell-" +i).append("<strong>Avg User Rating: </strong>" + response.restaurants[i].restaurant.user_rating.aggregate_rating +"<br>");
          }
        }
      }
      });
    }); 
 });



  //Display the Google Map
  
    function initMap() {
        var map = new google.maps.Map(document.getElementById("map"), {
          zoom: 12,
          center: {lat: 29.7632800, lng: -95.3632700}
        });
        var geocoder = new google.maps.Geocoder();

        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
        });
      }
      function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);

            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
        
          } else {
            alert('There are no results for this zip code. Please try a different zip code: ' + status);
          }
        });
      }

     