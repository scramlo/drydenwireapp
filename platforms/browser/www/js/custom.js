/*
==========================================
ARTICLES
==========================================
*/

var articlesCount;

//this will contain the articles window html markup array
var articlesWindowHTMLArr = [];

//this will contain the articles window html markup concantenated
var articlesWindowHTML = "";

//this will contain the body of the articles
var articlesBodyArray = [];

//This will contain arrays of sermon lists for each series.
var articlesListArray = [];

//base API address
var drydenwireJSON = "http://drydenwire.com/api/json-articles/";

//This will go up by 10 every time a request is made. so when
//the user clicks "Load More" it always has ProcessWire start pulling in
//articles from the next ten.
var retrieveStart = 0;

//make the query and parse it
getArticles(retrieveStart);

//Functions and Stuff

//Create get articles function
function getArticles(startArticle) {
  $.ajax({
    dataType: "json",
    type: "POST",
    data : {
      startResults : startArticle // will be accessible in $_POST['startResults']
    },
    url: drydenwireJSON,
    success: function(json) {
      //console.log(json);

      //up the retrieveCount counter
      retrieveStart += 10;

      //number of articles
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
        articlesWindowHTMLArr.push("<div class='card'>"); //0
        articlesWindowHTMLArr.push("<img class='card-img-top' src='" + articleImageURL + "'>"); //1
        articlesWindowHTMLArr.push("<div class='card-block'>"); //2
        articlesWindowHTMLArr.push("<small>" + articleDate + "</small>"); //3
        articlesWindowHTMLArr.push("<h4 class='card-title'>" + articleTitle + "</h4>"); //4
        articlesWindowHTMLArr.push("<button onclick='showArticle(" + i + ")' class='btn-primary btn-block article-button'>View Article</button>"); //5
        articlesWindowHTMLArr.push("</div><!--End Card Block -->"); //6
        articlesWindowHTMLArr.push("</div><!--End Card -->"); //7
        articlesWindowHTMLArr.push("<section id=\"load-more-section\"><button id=\"load-more-button\" class=\"btn btn-success btn-block\" onclick=\"getArticles(retrieveStart);\">Load More</button><br></section>"); //8

        //push article head and body to single article array
        articlesBodyArray.push(
          "<h3 class='text-xs-center'>" + articleTitle + "</h3>" + "<hr>"
          + "<img src='" + articleImageURL + "'>" + "<hr>"
          + articleBody
        );
      } //End for each loop

      //Join the array together.
      articlesWindowHTML = articlesWindowHTMLArr.join("");

      //After the splash screen, the first thing you see is the series window
      $("#articles-window").html(articlesWindowHTML);

    } //end success

  }); // End AJAX
}

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
