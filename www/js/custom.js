/*
==========================================
NAVIGATION
==========================================
*/

$("#articles-button").on("click", function() {
  $(".active").removeClass("active"); //remove active class from other button
  $(this).addClass("active"); //add active class to this button
  hideWindow();
  $("#articles-window").show();
  $("#button-section").show();
});

$("#obituaries-button").on("click", function() {
  $(".active").removeClass("active"); //remove active class from other button
  $(this).addClass("active"); //add active class to this button
  hideWindow();
  if (obituariesWindowHTML == "") {
    getObituaries(obitsRetrieveStart);
    $("#obituaries-window").show();
  } else {
    $("#obituaries-window").show();
  }
});

/*
==========================================
COMMON FUNCTIONS
==========================================
*/

function hideWindow() {
  $("#articles-window").hide();
  $("#obituaries-window").hide();
  $("#advertise-window").hide();
  $("#submit-window").hide();
  $("#button-section").hide();
  window.scrollTo(0,0);
}

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

//This is a counter to make the slide ins "waterfall"
var articlesDelaySeconds = 0;

//base articles API address
var articlesJSON = "http://drydenwire.com/api/json-articles/";

//This will go up by 10 every time a request is made. so when
//the user clicks "Load More" it always has ProcessWire start pulling in
//articles from the next ten.
var articlesRetrieveStart = 0;

//start the app by getting the articles
getArticles(articlesRetrieveStart);

//Create get articles function
function getArticles(startArticle) {
  $.ajax({
    dataType: "json",
    type: "POST",
    data : {
      startResults : startArticle // will be accessible in $_POST['startResults']
    },
    url: articlesJSON,
    success: function(json) {
      //console.log(json);

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
        articlesWindowHTMLArr.push("<div class='card animated bounceInLeft' style='animation-delay:" + articlesDelaySeconds + "s;'>"); //0
        articlesDelaySeconds += 0.3; //didn't want to forget to iterate :)
        articlesWindowHTMLArr.push("<img class='card-img-top' src='" + articleImageURL + "'>"); //1
        articlesWindowHTMLArr.push("<div class='card-block'>"); //2
        articlesWindowHTMLArr.push("<small>" + articleDate + "</small>"); //3
        articlesWindowHTMLArr.push("<h4 class='card-title'>" + articleTitle + "</h4>"); //4
        articlesWindowHTMLArr.push("<button onclick='showArticle(" + i + ")' class='btn-primary btn-block article-button'>View Article</button>"); //5
        articlesWindowHTMLArr.push("</div><!--End Card Block -->"); //6
        articlesWindowHTMLArr.push("</div><!--End Card -->"); //7

        //push article head and body to single article array
        articlesBodyArray.push(
          "<h3 class='text-xs-center'>" + articleTitle + "</h3>" + "<hr>"
          + "<img src='" + articleImageURL + "'>" + "<hr>"
          + articleBody
        );
      } //End for each loop

      //articlesWindowHTMLArr.push("<section id=\"load-more-section\"><button id=\"load-more-button\" class=\"btn btn-success btn-block\" onclick=\"getArticles(retrieveStart);\">Load More</button><br></section>");

      //Join the array together.
      articlesWindowHTML = articlesWindowHTMLArr.join("");//

      // fill screen
      $("#articles-window").html(articlesWindowHTML);
      $("#button-section").show();

      //up the retrieveCount counter
      articlesRetrieveStart += 10;

    } //end success

  }); // End AJAX
}

function showArticle(id) {
  hideWindow();
  $("#articles-window").html(articlesBodyArray[id]);
  $("#articles-window").show();
  $("#load-more-button").hide();
  $("#show-articles-button").show();
  $("#button-section").show();
}

function showArticles() {
  hideWindow();
  $("#show-articles-button").hide();
  $("#articles-window").html(articlesWindowHTML);
  $("#articles-window").show();
  $("#load-more-button").show();
}

/*
==========================================
OBITUARIES
==========================================
*/

var obituariesCount;

//this will contain the obituaries window html markup array
var obituariesWindowHTMLArr = [];

//this will contain the obituaries window html markup concantenated
var obituariesWindowHTML = "";

//this will contain the body of the obituaries
var obituariesBodyArray = [];

//This will contain arrays of sermon lists for each series.
var obituariesListArray = [];

//This is a counter to make the slide ins "waterfall"
var obituariesDelaySeconds = 0;

//base obituaries API address
var obituariesJSON = "http://drydenwire.com/api/json-obituaries/";

//This will go up by 10 every time a request is made. so when
//the user clicks "Load More" it always has ProcessWire start pulling in
//obituaries from the next ten.
var obitsRetrieveStart = 0;

//Create get obituaries function
function getObituaries(startobituary) {
  $.ajax({
    dataType: "json",
    type: "POST",
    data : {
      startResults : startobituary // will be accessible in $_POST['startResults']
    },
    url: obituariesJSON,
    success: function(json) {
      //console.log(json);

      //number of obituaries
      obituariesCount = Object.keys(json).length;

      //iterate through each series
      for (var i = 0; i < obituariesCount; i++) {

        //Create simple variables for obituaries.
        var obituaryTitle = json[i].title;
        var obituaryImageURL = json[i].fImageUrl;
        var obituaryDate = json[i].date;
        var obituaryBody = json[i].body;

        //add the full URL path to body images. Can't automate this in ProcessWire
        var obituaryBody = obituaryBody.replace(/\/site/g, "http://drydenwire.com/site");

        //This is a card style layout for the obituaries list.
        //It is pushed to an array which will be joined together as HTML.
        obituariesWindowHTMLArr.push("<div class='card animated bounceInLeft' style='animation-delay:" + obituariesDelaySeconds + "s;'>"); //0
        obituariesDelaySeconds += 0.3;
        obituariesWindowHTMLArr.push("<div class='card-block'>"); //1
        obituariesWindowHTMLArr.push("<img class='center-block img-fluid img-circle img-thumbnail' src='" + obituaryImageURL + "'>"); //2
        obituariesWindowHTMLArr.push("<small>" + obituaryDate + "</small>"); //3
        obituariesWindowHTMLArr.push("<h4 class='card-title'>" + obituaryTitle + "</h4>"); //4
        obituariesWindowHTMLArr.push("<button onclick='showObituary(" + i + ")' class='btn-primary btn-block obituary-button'>View obituary</button>"); //5
        obituariesWindowHTMLArr.push("</div><!--End Card Block -->"); //6
        obituariesWindowHTMLArr.push("</div><!--End Card -->"); //7

        //push obituary head and body to single obituary array
        obituariesBodyArray.push(
          "<h3 class='text-xs-center'>" + obituaryTitle + "</h3>" + "<hr>"
          + "<img src='" + obituaryImageURL + "'>" + "<hr>"
          + obituaryBody
        );
      } //End for each loop

      //Join the array together.
      obituariesWindowHTML = obituariesWindowHTMLArr.join("");//

      //fill screen
      $("#obituaries-window").html(obituariesWindowHTML);

      //up the retrieveCount counter
      obitsRetrieveStart += 10;

    } //end success

  }); // End AJAX
}

function showObituary(id) {
  hideWindow();
  $("#obituaries-window").html(obituariesBodyArray[id]);
  $("#show-obituaries-button").show();
}

function showObituaries() {
  hideWindow();
  $("#show-obituaries-button").hide();
  $("#obituaries-window").html(obituariesWindowHTML);
  $("#load-more-button").show();
}
