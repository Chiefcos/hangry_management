// Firebase
var config = {
  apiKey: "AIzaSyCEy9bC6uS5eeI8oijSHGQ-Anw0iT_2hLc",
  authDomain: "myawesomeproject-10537.firebaseapp.com",
  databaseURL: "https://myawesomeproject-10537.firebaseio.com",
  projectId: "myawesomeproject-10537",
  storageBucket: "myawesomeproject-10537.appspot.com",
  messagingSenderId: "96513436362"
};
firebase.initializeApp(config);

// Variables
// ================================================================================

// Get a reference to the database service
var database = firebase.database();

// Initializing our click count at 0
var clickCounter = 0;
var recipeCount = 0;

var recipeIngredients = {
  ingredients: ["spinach", "lemon", "chicken", "broth"]
};
// Functions
// ================================================================================

$("#bookmark").on("click", function() {
  var response = database.ref().push({
    recipeList: recipeIngredients
  });
  console.log("i am response", response);
  var dataNameRecipe = response.path.n;
  console.log("Important Data" + dataNameRecipe);
});
// On Click
$(".counter").on("click", function() {
  // Add 1 to clickCounter
  clickCounter++;

  //   access the database and save the data for click counter
  database.ref().push({
    clickCount: clickCounter
  });
});

// the bookmarking click event
$("#dropDownMenu").on("click", function() {
  console.log("im being clicked");
  recipeCount++;
  console.log(recipeCount);
  var recipeList = $("<ul>");
  var recipeLink = $("<a>").attr("href", "#");
  var recipeItem = $("<li>");
  recipeItem.text(" Recipe #" + recipeCount);

  recipeLink.append(recipeItem);
  recipeList.append(recipeLink);
  $("#test").append(recipeList);

  var data = document.getElementById("test");
  console.log("im the data", data);
});
// database.ref().on(
//   "value",
//   function(snapshot) {
//     // Then we console.log the value of snapshot
//     console.log(snapshot.val());

//     // Update the clickCounter variable with data from the database.
//     clickCounter = snapshot.val().clickCount;

//     // Then we change the html associated with the number.
//     $(".counter").text(snapshot.val().clickCount);

//     // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
//     // Again we could have named errorObject anything we wanted.
//   },
//   function(errorObject) {
//     // In case of error this will print the error
//     console.log("The read failed: " + errorObject.code);
//   }
// );
// Youtube API Pull and IFrame Player

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}
var videoId;
var videoQuery = "garlic beef";
var queryURL =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
  videoQuery +
  "+recipe&type=video&key=AIzaSyAaJCFnN_yhqsDaDZY5V2QhoFQnExxckRI";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
  videoId = response.items[0].id.videoId;
  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
});

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "390",
    width: "640",
    videoId: videoId,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}
