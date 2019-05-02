// Edamam API
// ================================================================================``
var recipeDiv;
var ingredients;

var recipeDiv;

$("#search-form").on("submit", function(event) {
  event.preventDefault();
  $("#recipe-results").html("");

  var searchIngredient = $("#ingredient").val();
  var resultsQuantity = $("#results-quantity").val();

  var maxCalories = $(".calories").val();
  //?high-fiber breaks it.
  var diet = "";
  if ($(".diet").is(":checked")) {
    diet = "&dietLabels=" + $(".diet:checked").val();
  }

  var time = "&time=" + $(".time").val();
  if ($(".time").val() === "") {
    time = "";
  }

  var healthArray = [];
  var healthString = "";
  $.each($(".health:checked"), function() {
    healthArray.push($(this).val());
    healthString = "&healthLabels=" + healthArray.join("&healthLabels=");
  });

  // var cuisineArray=[];
  // var cuisineString = "";
  // $.each($(".cuisine:checked"), function() {
  //     cuisineArray.push($(this).val());
  //     cuisineString = "&cuisine=" + cuisineArray.join("&cuisine=")
  // })

  //excluded can have multiple responses separated by a space
  var excludedArray = [];
  if ($(".excluded").val() === "") {
    var excludedString = "";
  } else {
    $.each($(".excluded"), function() {
      excludedArray = $(this)
        .val()
        .split(" ");
      excludedString = "&excluded=" + excludedArray.join("&excluded=");
    });
  }

  var queryURL =
    "https://api.edamam.com/search?q=" +
    searchIngredient +
    "&app_id=df8f013e&app_key=371aa3e4099265f1b0d249cf790f4336&from=0&to=" +
    resultsQuantity +
    "&calories=1-" +
    maxCalories +
    diet +
    time +
    healthString +
    excludedString;

  var recipeTitle;
  var results;

  console.log("query URL: " + queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    // console.log("results: " + results)

    for (var i = 0; i < response.hits.length; i++) {
      recipeTitle = response.hits[i].recipe.label;
      ingredients = [];
      for (j = 0; j < response.hits[i].recipe.ingredients.length; j++) {
        ingredients.push(" " + response.hits[i].recipe.ingredients[j].text);
      }
      // console.log("ingredients: " + ingredients);
      // console.log(response.hits[i].recipe.ingredients)

      // var listIngredients = $("<ul></ul>")
      //     for (n = 0; n < response.hits[i].recipe.ingredients.length; n++) {
      //         listIngredients.append("<li>" + response.hits[i].recipe.ingredients[n].text);
      //     }

      // console.log("list ingredients: " + listIngredients);

      // $("#ingredients-test").append(listIngredients);

      var servings = response.hits[i].recipe.yield;
      var totalCalories = response.hits[i].recipe.calories;
      var caloriesPerServing = Math.round(totalCalories / servings);
      var dietLabel = [];
      for (k = 0; k < response.hits[i].recipe.dietLabels.length; k++) {
        dietLabel.push(" " + response.hits[i].recipe.dietLabels[k]);
      }
      // console.log("diet label: " + dietLabel);
      var healthLabel = [];
      for (l = 0; l < response.hits[i].recipe.healthLabels.length; l++) {
        healthLabel.push(" " + response.hits[i].recipe.healthLabels[l]);
      }
      // console.log("healthLabel: " + healthLabel);
      var totalNutrients = "";

      for (var m in response.hits[i].recipe.totalNutrients) {
        totalNutrients +=
          "<p> " + response.hits[i].recipe.totalNutrients[m].label;
        totalNutrients +=
          " " + Math.round(response.hits[i].recipe.totalNutrients[m].quantity);
        totalNutrients +=
          " " + response.hits[i].recipe.totalNutrients[m].unit + "</p>";
        // console.log("m: " + m);
      }

      var recipeYield = response.hits[i].recipe.yield;

      var linkToInstructions = response.hits[i].recipe.url;

      var recipeDiv = $("<div>");

      var recipeImage = $("<img>");
      recipeImage.attr("src", response.hits[i].recipe.image);

      recipeDiv.attr("id", "recipe-click");
      recipeDiv.attr("data-title", recipeTitle);
      recipeDiv.attr("data-ingredients", ingredients);
      recipeDiv.attr(
        "data-ingredientsData",
        JSON.stringify(response.hits[i].recipe.ingredients)
      );
      recipeDiv.attr("data-yield", recipeYield);
      recipeDiv.attr("data-caloriesperserv", caloriesPerServing);
      recipeDiv.attr("data-dietLabel", dietLabel);
      recipeDiv.attr("data-healthLabel", healthLabel);
      recipeDiv.attr("data-totalNutrients", totalNutrients);
      recipeDiv.attr("data-linkToInstructions", linkToInstructions);
      recipeDiv.attr("data-image", response.hits[i].recipe.image);

      var title = $("<p>").text("Title: " + recipeTitle);
      var arrayOfIngredients = $("<p>").text("Ingredients: " + ingredients);
      var displayCaloriesPerServing = $("<p>").text(
        "Calories per Serving: " + caloriesPerServing
      );

      recipeDiv.append(recipeImage);
      recipeDiv.append(title);
      recipeDiv.append(arrayOfIngredients);
      recipeDiv.append(displayCaloriesPerServing);

      $("#recipe-results").append(recipeDiv);
    }
    videoSearch(recipeTitle);
  });

  this.reset();
});

$(document).on("click", "#recipe-click", function() {
  $("#single-recipe").html("");
  var singleRecipeDiv = $("<div>");

  // var videoDiv = $("div");
  // videoDiv.addClass("col-md-6");
  // videoDiv.attr("id", "player");

  var singleRecipeImage = $("<img>");
  singleRecipeImage.attr("src", $(this).attr("data-image"));

  var singleRecipeTitle = $("<p>").text(
    "Recipe title: " + $(this).attr("data-title")
  );

  var ingredientList = $("<ul>");
  var ingredientsArray = JSON.parse($(this).attr("data-ingredientsData"));

  for (i = 0; i < ingredientsArray.length; i++) {
    // var addToShoppingList = $("<button>+</button>");
    // addToShoppingList.text("+");
    // addToShoppingList.addClass("add-to-shopping-list")
    var listItem = $("<li id='add-to-shopping'>");
    listItem.attr("data-ingredientText", ingredientsArray[i].text);
    listItem.append("<button>+</button>" + ingredientsArray[i].text);

    console.log("data-ingredientText" + ingredientsArray[i].text);
    ingredientList.append(listItem);
    // ingredientList.append(addToShoppingList);
  }

  var singleRecipeYield = $("<p>").text(
    "This recipe yields " + $(this).attr("data-yield") + " servings"
  );
  var singleRecipeCalPerS = $("<p>").text(
    "Calories per Serving: " + $(this).attr("data-caloriesperserv")
  );
  var singleRecipeDietLabel = $("<p>").text(
    "Diet Labels: " + $(this).attr("data-dietLabel")
  );
  var singleRecipeHealthLabel = $("<p>").text(
    "Health Labels: " + $(this).attr("data-healthLabel")
  );
  var singleRecipetotalNutrients = $("<p>").html(
    "Total Nutrients: " + $(this).attr("data-totalNutrients")
  );
  var singleRecipeLinkToInstructions = $("<p>").html(
    "<a href=" +
      $(this).attr("data-linkToInstructions") +
      " target='_blank'>Link to full instructions</a>"
  );

  // singleRecipeIngredients.attr("id", "click-ingredients");
  // singleRecipeIngredients.attr("data-ingredientsToFav", ingredientsToFavorite);

  singleRecipeDiv.append(singleRecipeImage);
  singleRecipeDiv.append(singleRecipeTitle);
  singleRecipeDiv.append(ingredientList);
  singleRecipeDiv.append(singleRecipeYield);
  singleRecipeDiv.append(singleRecipeCalPerS);
  singleRecipeDiv.append(singleRecipeDietLabel);
  singleRecipeDiv.append(singleRecipeHealthLabel);
  singleRecipeDiv.append(singleRecipetotalNutrients);
  singleRecipeDiv.append(singleRecipeLinkToInstructions);
  // singleRecipeDiv.append(videoDiv);

  $("#single-recipe").append(singleRecipeDiv);
  $(".video-container").attr("id", "player");
  // console.log("ingredients to favorite: " + ingredientsToFavorite);
});

var shoppingList = JSON.parse(localStorage.getItem("shoppingList"));
if (shoppingList === null) {
  shoppingList = [];
}

function renderShoppingList() {
  $("#shopping-list").empty();
  for (i = 0; i < shoppingList.length; i++) {
    var shoppingContainer = $("<figure>");

    var deleteItem = $("<button>");
    deleteItem.attr("data-index", i);
    deleteItem.text("-");
    deleteItem.addClass("delete");

    shoppingContainer.append(shoppingList[i] + "<br>");
    shoppingContainer.append(deleteItem);
    $("#shopping-list").prepend(shoppingContainer);
  }
}

renderShoppingList();

$(document).on("click", "#add-to-shopping", function() {
  // console.log($(this))
  console.log("data attr: " + $(this).attr("data-ingredientText"));
  event.preventDefault();

  var shoppingItem = $(this).attr("data-ingredientText");

  // var newItem = {
  //     name: shoppingItem
  // }

  shoppingList.push(shoppingItem);
  renderShoppingList();
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
});

$(document).on("click", ".delete", function() {
  var index = $(this).attr("data-index");
  shoppingList.splice(index, 1);
  renderShoppingList();
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
});

// Firebase
// ================================================================================

// The Firebase configuration
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
// =====================================
// Get a reference to the database service
var database = firebase.database();

// Initializing our counters at 0
var clickCounter = 0;
var recipeCount = 0;

// Some blank containers that we will fill in later
var recipeList;
var recipeItem;
var firebaseRecipe = [];

// this holds the ingredients of the recipe
var recipeIngredients = {
  ingredients: ["hello", "goodbye"]
};
// Functions
// =====================================
// this makes the bookmarked recipes appear
$(".recipelist").hide();
$("#dropDownMenu").on("click", function() {
  $(".recipelist").toggle();
});
console.log(recipeIngredients);
// this bookmarks the ingredients to the firebase database
$("#bookmark").on("click", function() {
  database.ref().push({
    recipeList: recipeIngredients
  });

  // Here we create a recipe header for the drop down menu
  recipeCount++;
  recipeList = $("<p>");
  recipeList.text(" Recipe #" + recipeCount);
  $("#test").append(recipeList);

  printFirebaseRecipe();
});
// This is the click counter function

// Here we retrieve the data out of the firebase database and display it on the screen
function printFirebaseRecipe() {
  database.ref().once(
    "child_added",
    function(snapshot) {
      var ingredientsArray = snapshot.val().recipeList.ingredients;
      var ingredientsList = $("<ul>");

      for (let k = 0; k < ingredientsArray.length; k++) {
        var ingredientsItem = $("<li>");

        ingredientsItem.text(ingredientsArray[k]);
        ingredientsList.append(ingredientsItem);
        recipeList.append(ingredientsList);
      }
      // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
    },

    function(errorObject) {
      // In case of error this will print the error
      console.log("The read failed: " + errorObject.code);
    }
  );
}

function clickCounterFirebase(recipeName, clickCounter) {
  database.ref().push({
    recipe: [recipeName, clickCounter]
  });
  database.ref().once("value", function(snapshot) {
    var firebaseReference = snapshot.val().recipe;
    console.log("inside firebase", clickCounter);
    console.log("inside firebase", firebaseReference);
    console.log("inside firebase", firebaseRecipe);
    console.log(recipeName);
    if (firebaseRecipe.indexOf(recipeName) === -1) {
      clickCounter = 0;
      console.log(clickCounter);
    } else firebaseRecipe.push(firebaseReference);
  });
}

$(".counter").on("click", function(firebaseRef) {
  // Add 1 to clickCounter
  var recipeName = $(this).attr("data-name");
  var recipeNameArray = [];
  recipeNameArray.push(recipeName);
  console.log("recipe name", recipeName);
  $(this).attr("clicks", clickCounter++);
  console.log("click count inside .counter click function ", clickCounter);

  //if ( this will check if "data-name" is the same as it was, when its different)
  // this will then push the last value of the clickcounter into the firebase database which is connected to the old "data-name"
  // then it will set clickcount to 0 for the new "data-name"

  //if ( the name is equal to a child in the firebase database)
  // take the value of clickcount of the firebase database and start itterating from ther (clickCount++)

  //   We save the click count to the database
  clickCounterFirebase(recipeName, clickCounter);
});

// Youtube API Pull and IFrame Player
// ================================================================================

var player;
var videoId;

function videoSearch(recipeTitle) {
  console.log("im recipetitle inside video search", recipeTitle);
  var queryURL =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
    recipeTitle +
    "+recipe&type=video&key=AIzaSyAaJCFnN_yhqsDaDZY5V2QhoFQnExxckRI";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    videoId = response.items[0].id.videoId;
    console.log("videoId inside video search", videoId);
    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
  });
}

// Variables
console.log(videoId);
// 2. This code loads the IFrame Player API code asynchronously.
$(document).on("click", ".video-container", function(player, videoId) {
  alert("im running");
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
  // this is a placeholder for the actual recipe
  // This is the API call where we can search our results

  // Here we call the function for the API
  console.log("im video id outside", videoId);
  // This establishes the player on the HTML page
  function onYouTubeIframeAPIReady(videoId) {
    console.log("im videoId inside of onyoutubeiframapiready", videoId);
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
  onYouTubeIframeAPIReady(videoId);
});
