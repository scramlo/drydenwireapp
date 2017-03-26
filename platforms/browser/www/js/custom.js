/*
==========================================
ARTICLES
==========================================
*/

var articlesCount;

//this will contain the articles window html markup
var articlesWindowHTML = [];

//this will contain the body of the articles
var articlesBodyArray = [];

//This will contain arrays of sermon lists for each series.
var articlesListArray = [];

//base API address
var drydenwireJSON = "http://drydenwire.com/api/json-articles/";

//make the query and parse it
$.ajax({
  dataType: "json",
  url: drydenwireJSON,
  success: function(json) {
    //console.log(json);

    //number of series
    articlesCount = Object.keys(json).length;

    //iterate through each series
    for (var i = 0; i < articlesCount; i++) {

      //Create simple variables for articles.
      var articleTitle = json[i].title;
      var articleImageURL = json[i].fImageUrl;
      var articleDate = json[i].date;
      var articleBody = json[i].body;

      //add the full URL path to body images. Can't automate this in ProcessWire
      var articleBody = articleBody.replace(/\/site/g, "http://drydenwire.com/site");

      //This is a card style layout for the articles list.
      //It is pushed to an array which will be joined together as HTML.
      articlesWindowHTML.push("<div class='card'>");
      articlesWindowHTML.push("<img class='card-img-top' src='" + articleImageURL + "'>");
      articlesWindowHTML.push("<div class='card-block'>");
      articlesWindowHTML.push("<small>" + articleDate + "</small>");
      articlesWindowHTML.push("<h4 class='card-title'>" + articleTitle + "</h4>");
      articlesWindowHTML.push("<button onclick='showArticle(" + i + ")' class='btn-primary btn-block article-button'>View Article</button>");
      articlesWindowHTML.push("</div><!--End Card Block -->");
      articlesWindowHTML.push("</div><!--End Card -->");

      //push article head and body to single article array
      articlesBodyArray.push(
        "<h3 class='text-xs-center'>" + articleTitle + "</h3>" + "<hr>"
        + "<img src='" + articleImageURL + "'>" + "<hr>"
        + articleBody
      );
    }

    //Join the array together.
    articlesWindowHTML = articlesWindowHTML.join("");

    //After the splash screen, the first thing you see is the series window
    $("#articles-window").html(articlesWindowHTML);

  } //end success

}); // End AJAX

function showArticle(id) {
  eraseWindow();
  $("#articles-window").html(articlesBodyArray[id]);
}

function eraseWindow() {
  $("#articles-window").html("");
  $("#advertise-window").html("");
  $("#obituaries-window").html("");
  $("#submit-window").html("");
  window.scrollTo(0,0);
}

//Navigation
$("#articles-button").on("click", function() {
  eraseWindow();
  $("#articles-window").html(articlesWindowHTML);
});
