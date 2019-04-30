var recipeDiv;

    $("#search-form").on("submit", function (event) {
        event.preventDefault();
        var searchIngredient = $("#ingredient").val()
        var maxCalories = $(".calories").val()
        //high-fiber breaks it.
        var diet = "";
            if ($(".diet").is(":checked")) {
                diet = "&diet=" + $(".diet:checked").val();
            }

        var time = "&time=" + $(".time").val()
            if ($(".time").val() === "") {
                time = ""
            }

        var healthArray = [];
        var healthString = "";
        $.each($(".health:checked"), function() {
            healthArray.push($(this).val());
            healthString = "&health=" + healthArray.join("&health=")
        }) 

        var cuisineArray=[];
        var cuisineString = "";
        $.each($(".cuisine:checked"), function() {
            cuisineArray.push($(this).val());
            cuisineString = "&cuisine=" + cuisineArray.join("&cuisine=")
        }) 

        //no dishTypes work
        var dishTypeArray=[];
        var dishTypeString = "";
        $.each($(".dish-type:checked"), function() {
            dishTypeArray.push($(this).val());
            dishTypeString = "&dishType=" + dishTypeArray.join("&dishType=")
        }) 

        //excluded can have multiple responses separated by a space
        var excludedArray=[];
        var excludedString = "";
        $.each($(".excluded"), function() {
            excludedArray = ($(this).val()).split(" ");
            excludedString = "&excluded=" + excludedArray.join("&excluded=")
        }) 

        var queryURL = "https://api.edamam.com/search?q=" + searchIngredient + 
            "&app_id=df8f013e&app_key=371aa3e4099265f1b0d249cf790f4336&from=0&to=3&calories=1-" + maxCalories + diet + time
            + healthString + cuisineString + excludedString;
        
        var recipeTitle;
        var results;
        

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
                        ingredients.push(" " + response.hits[i].recipe.ingredients[j].text)   
                    }
                    console.log("ingredients: " + ingredients);
                var servings = response.hits[i].recipe.yield;
                var totalCalories = response.hits[i].recipe.calories;
                var caloriesPerServing = Math.round(totalCalories/servings);

                var recipeDiv = $("<div>");

                var recipeImage = $("<img>");
                recipeImage.attr("src", response.hits[i].recipe.image);
                recipeImage.attr("id", "image-click");

                var p = $("<p>").text("Title: " + recipeTitle);
                var listOfIngredients = $("<p>").text("Ingredients: " + ingredients);
                var displayCaloriesPerServing = $("<p>").text("Calories per Serving: " + caloriesPerServing);

                recipeDiv.append(recipeImage);
                recipeDiv.append(p);
                recipeDiv.append(listOfIngredients);
                recipeDiv.append(displayCaloriesPerServing);

                $("#recipe-results").append(recipeDiv);
            }



        });
    })

function displaySingleRecipeDetails () {
    $("#single-recipe").html("<h1>" + "hello" + "</h1>");
}


$(document).on("click", "#image-click", function() {
    displaySingleRecipeDetails();
    
    
})

    