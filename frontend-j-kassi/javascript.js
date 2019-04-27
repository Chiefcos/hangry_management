$("#tile-button").on("click", function {
    // switch the result-div width and the contents within it
    
    // var resultItem = $("<div>");
    // resultItem.addClass("result-div");
    // resultItem.attr("width", "100px");
    // $("#multi-results").append(resultItem);
    // switch the attribute class "listview"
    $("result-div").attr("list-view", "false");
    $("result-div").attr("width", "100px");

});

$("#list-button").on("click", function {
    // switch the result-div width and the contents within it
    $("result-div").attr("list-view", "true");
    $("result-div").attr("width", "100%");
});

// $("p").css("background-image");