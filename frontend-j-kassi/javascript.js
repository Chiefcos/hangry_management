var recipeDiv;

$("#search-form").on("submit", function (event) {
    event.preventDefault();
    $("#recipe-results").html("");
    var searchIngredient = $("#ingredient").val();
    var resultsQuantity = $("#results-quantity").val();
    var maxCalories = $(".calories").val();
    //high-fiber breaks it.
    var diet = "";
    if ($(".diet").is(":checked")) {
        diet = "&dietLabels=" + $(".diet:checked").val();
    }
    var time = "&time=" + $(".time").val();
    if ($(".time").val() === "") {
        time = ""
    }
    var healthArray = [];
    var healthString = "";
    $.each($(".health:checked"), function() {
        healthArray.push($(this).val());
        healthString = "&healthLabels=" + healthArray.join("&healthLabels=")
    }) 
    // var cuisineArray=[];
    // var cuisineString = "";
    // $.each($(".cuisine:checked"), function() {
    //     cuisineArray.push($(this).val());
    //     cuisineString = "&cuisine=" + cuisineArray.join("&cuisine=")
    // }) 
    //excluded can have multiple responses separated by a space
    var excludedArray=[];
    if ($(".excluded").val() === ""){
        var excludedString = "";
    } else {
        $.each($(".excluded"), function() {
            excludedArray = ($(this).val()).split(" ");
            excludedString = "&excluded=" + excludedArray.join("&excluded=")
        }) 
    }
    
    var queryURL = "https://api.edamam.com/search?q=" + searchIngredient + 
        "&app_id=df8f013e&app_key=371aa3e4099265f1b0d249cf790f4336&from=0&to=" + resultsQuantity +
         "&calories=1-" + maxCalories + diet + time + healthString + excludedString;
    
    var recipeTitle;
    var results;
    
    console.log("query URL: " + queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
        console.log(response);
        // console.log("results: " + results)
        
        for (var i = 0; i < response.hits.length; i++) {
            var recipeTitle = response.hits[i].recipe.label;
            var ingredients = [];
                for (j = 0; j < response.hits[i].recipe.ingredients.length; j++) {
                    ingredients.push(" " + response.hits[i].recipe.ingredients[j].text);  
                }
                // console.log("ingredients: " + ingredients);
            var servings = response.hits[i].recipe.yield;
            var totalCalories = response.hits[i].recipe.calories;
            var caloriesPerServing = Math.round(totalCalories/servings);
            var dietLabel = [];
                for (k=0; k < response.hits[i].recipe.dietLabels.length; k++) {
                    dietLabel.push(" " + response.hits[i].recipe.dietLabels[k]);
                }
            // console.log("diet label: " + dietLabel);
            var healthLabel=[];
                for (l=0; l < response.hits[i].recipe.healthLabels.length; l++) {
                    healthLabel.push(" " + response.hits[i].recipe.healthLabels[l]);
                }
            // console.log("healthLabel: " + healthLabel);
            var totalNutrients=[];
                for (m=0; m < response.hits[i].recipe.totalNutrients.length; m++) {
                    totalNutrients.push("Nutrient: " + response.hits[i].recipe.totalNutrients[m].label);
                    totalNutrients.push("Qty: " + response.hits[i].recipe.totalNutrients[m].quantity);
                    totalNutrients.push(" " + response.hits[i].recipe.totalNutrients[m].unit);
                }
            // console.log("total Nutrients: " + totalNutrients);
            var recipeYield=response.hits[i].recipe.yield;
            
            var linkToInstructions = response.hits[i].recipe.url;
            var recipeDiv = $("<div>");
            recipeDiv.attr("id", "recipe-click");
            recipeDiv.attr("data-title", recipeTitle);
            recipeDiv.attr("data-ingredients", ingredients);
            recipeDiv.attr("data-yield", recipeYield);
            recipeDiv.attr("data-caloriesperserv", caloriesPerServing);
            recipeDiv.attr("data-dietLabel", dietLabel);
            recipeDiv.attr("data-healthLabel", healthLabel);
            recipeDiv.attr("data-totalNutrients", totalNutrients);
            recipeDiv.attr("data-linkToInstructions", linkToInstructions);
            recipeDiv.attr("data-image", response.hits[i].recipe.image);
            var recipeImage = $("<img>");
            recipeImage.attr("src", response.hits[i].recipe.image);
            
            var title = $("<p>").text("Title: " + recipeTitle);
            var listOfIngredients = $("<p>").text("Ingredients: " + ingredients);
            var displayCaloriesPerServing = $("<p>").text("Calories per Serving: " + caloriesPerServing);
            recipeDiv.append(recipeImage);
            recipeDiv.append(title);
            recipeDiv.append(listOfIngredients);
            recipeDiv.append(displayCaloriesPerServing);
            $("#recipe-results").append(recipeDiv);
        }
    });
    this.reset();
})
$(document).on("click", "#recipe-click", function() {
    //image and total nutrients not working
    var singleRecipeDiv = $("<div>");
    var singleRecipeImage = $("<img>");
    singleRecipeImage.attr("src", $(this).attr("data-image"));
    var singleRecipeTitle = $("<p>").text("Recipe title: " + $(this).attr("data-title"));
    var singleRecipeIngredients = $("<p>").text("Recipe Ingredients: " + $(this).attr("data-ingredients"));
    var singleRecipeYield = $("<p>").text("This recipe yields " + $(this).attr("data-yield") + " servings");
    var singleRecipeCalPerS = $("<p>").text("Calories per Serving: " + $(this).attr("data-caloriesperserv"));
    var singleRecipeDietLabel = $("<p>").text("Diet Labels: " +  $(this).attr("data-dietLabel"));
    var singleRecipeHealthLabel = $("<p>").text("Health Labels: " + $(this).attr("data-healthLabel"));
    var singleRecipetotalNutrients = $("<p>").text("Total Nutrients: " + $(this).attr("data-totalNutrients"));
    var singleRecipeLinkToInstructions = $("<p>").html("<a href=" + $(this).attr("data-linkToInstructions") 
        + " target='_blank'>Link to full instructions</a>");
    singleRecipeDiv.append(singleRecipeImage);
    singleRecipeDiv.append(singleRecipeTitle);
    singleRecipeDiv.append(singleRecipeIngredients);
    singleRecipeDiv.append(singleRecipeYield);
    singleRecipeDiv.append(singleRecipeCalPerS);
    singleRecipeDiv.append(singleRecipeDietLabel);
    singleRecipeDiv.append(singleRecipeHealthLabel);
    singleRecipeDiv.append(singleRecipetotalNutrients);
    singleRecipeDiv.append(singleRecipeLinkToInstructions);
    $("#single-recipe").append(singleRecipeDiv);
    
    
    
});

// $("#tile-button").on("click", function {
    // switch the #all-results width and the contents within it
    
    // var resultItem = $("<div>");
    // resultItem.addClass("#all-results");
    // resultItem.attr("width", "100px");
    // $("#multi-results").append(resultItem);
    // switch the attribute class "listview"
//     $("#all-results").attr("list-view", "false");
//     $("#all-results").attr("width", "100px");
//     $("food-photo").css("background-image", "url(https://via.placeholder.com/100)");
//     $("food-photo").attr("width", "95px");
// });

// $("#list-button").on("click", function {
    // switch the #all-results width and the contents within it
//     $("#all-results").attr("list-view", "true");
//     $("#all-results").attr("width", "100%");
// });

// $("p").css("background-image");


$("#fa-search").on("click", function {
    var userInput = $("#form-control").val();
    $("#user-input").text(userInput);
    // JSON.stringify(obj);
    // $(".recipe-image").html("<img src=" + response.hits[0].recipe.image + ">");
    // $(".recipe-title").text("recipe title: " + response.hits[0].recipe.label);

    // $("#all-results").append(oneResult);
});


// solved this issue by switching button type
// $("#form-control").on("submit", function {
         
    // $('input#submit').trigger("click"); 
//     $(".fas fa-search fa-3x").trigger("click");

// });



