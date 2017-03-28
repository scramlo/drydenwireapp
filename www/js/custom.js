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
SHARED FUNCTIONS
==========================================
*/

function hideWindow() {
  $("#articles-window").hide();
  $("#obituaries-window").hide();
  $("#advertise-window").hide();
  $("#submit-window").hide();
  window.scrollTo(0,0);
}

/*
==========================================
ARTICLES
==========================================
*/

var articlesCount;

//this will contain the articles window html markup array
var articlesListHTMLArr = [];

//this will contain the articles window html markup concantenated
var articlesListHTML = "";

//this will contain the body of the articles
var articlesBodyArray = [];

//this counts how many articles are pulled in so we put in the right IDs.
var articleCount = 0;

//base articles API address
var articlesJSON = "http://drydenwire.com/api/json-articles/";

//This will go up by 10 every time a request is made. so when
//the user clicks "Load More" it always has ProcessWire start pulling in
//articles from the next ten.
var articlesRetrieveStart = 0;

//This will take in the current scroll coordinates in the articles list.
//When a single article is displayed, the window is scrolled to the top.
//But when that single article is hidden and you now see the articles list
//You'll would be at the bottom.
var scrollLocationX;
var scrollLocationY;

//start the app by getting the articles
getArticles(articlesRetrieveStart);

//Create get articles function
function getArticles(startArticle) {

  //hide articles-list on app start
  //so we can control how long to show the loader for a good UI experience
  if (articlesRetrieveStart === 0) {
    $("#articles-list").hide();
  }

  //Show loading spinner
  $("#spinner").show();

  //This is a counter to make the slide ins "waterfall"
  var articlesDelaySeconds = 0;

  //hide show-articles-button ... this should only be seen on a single article
  $("#show-articles-button").hide();

  //AJAX Call
  $.ajax({
    dataType: "json",
    type: "POST",
    data : {
      startResults : startArticle // will be accessible in $_POST['startResults']
    },
    url: articlesJSON,
    success: function(json) {
      console.log(json);

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

        //easily control the animation here
        var animated = " animated bounceInLeft' style='animation-delay:" + articlesDelaySeconds + "s;";

        //I'm turning off animations right now.
        if ("Brian" !== "Awesome") {
          animated = "";
        }

        //This is a card style layout for the articles list.
        //It is pushed to an array which will be joined together as HTML.
        articlesListHTMLArr.push("<div class='card" + animated + "'>"); //0
        articlesDelaySeconds += 0.2; //didn't want to forget to iterate :)
        articlesListHTMLArr.push("<img class='card-img-top' src='" + articleImageURL + "'>"); //1
        articlesListHTMLArr.push("<div class='card-block'>"); //2
        articlesListHTMLArr.push("<small>" + articleDate + "</small>"); //3
        articlesListHTMLArr.push("<h4 class='card-title'>" + articleTitle + "</h4>"); //4
        articlesListHTMLArr.push("<button onclick='showArticle(" + articleCount + ")' class='btn-primary btn-block article-button'>View Article</button>"); //5
        articlesListHTMLArr.push("</div><!--End Card Block -->"); //6
        articlesListHTMLArr.push("</div><!--End Card -->"); //7

        //increment article count
        articleCount++;

        //push article head and body to single article array
        articlesBodyArray.push(
          "<h3 class='text-xs-center'>" + articleTitle + "</h3>" + "<hr>"
          + "<img src='" + articleImageURL + "'>" + "<hr>"
          + articleBody
        );
      } //End for each loop

      //Join the array together.
      articlesListHTML = articlesListHTMLArr.join("");//

      //fill articles list container and hide spinner
      $("#articles-list").html(articlesListHTML);
      $("#spinner").fadeOut(function() {
        $("#articles-list").show();
        $("#load-articles-button").show();
        $("#button-section").show();
      });

      //up the retrieveCount counter
      articlesRetrieveStart += 10;

    } //end success

  }); // End AJAX
}

/* ARTICLES EVENT HANDLERS */

$("#load-articles-button").on("click", function() {
  $(this).hide(0, function() {
    getArticles(articlesRetrieveStart);
  });
});

$("#show-articles-button").on("click", function() {
  showArticles();
});

/* ARTICLES FUNCTIONS */

function showArticle(id) {
  scrollLocationX = window.pageXOffset || document.documentElement.scrollLeft;
  scrollLocationY  = window.pageYOffset || document.documentElement.scrollTop;
  $("#articles-single").html(articlesBodyArray[id]);
  $("#articles-list").hide();
  window.scroll(0,0);
  $("#articles-single").show();
  $("#load-articles-button").hide();
  $("#show-articles-button").show();
}

function showArticles() {
  $("#articles-single").hide();
  $("#show-articles-button").hide();
  $("#articles-list").show();
  $("#load-articles-button").show();
  window.scroll(scrollLocationX, scrollLocationY);
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

//base obituaries API address
var obituariesJSON = "http://drydenwire.com/api/json-obituaries/";

//This will go up by 10 every time a request is made. so when
//the user clicks "Load More" it always has ProcessWire start pulling in
//obituaries from the next ten.
var obitsRetrieveStart = 0;

//Create get obituaries function
function getObituaries(startobituary) {

  $("#spinner").show();

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

      //This is a counter to make the slide ins "waterfall"
      var obituariesDelaySeconds = 0;

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
      $("#spinner").fadeOut();
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
  $("#load-articles-button").show();
}
