//express setup
var express = require('express');
var app = express();
//var PORT = process.env.PORT || 3000;

//request setup
var request = require('request');
//cheerio setup
var cheerio = require('cheerio');

//middleware init
app.use("/jscripts", express.static("public/jscripts"));
app.use("/css", express.static("public/css"));

//body-parser setup
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));

//handlebars setup
var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//data scraping using cheerio
request('https://www.reddit.com/', function (error, response, html) {
  var $ = cheerio.load(html);
  var result = [];
  $(".title").each(function(i, element){

    //scrape some stuff, put it in an object and add it to the result array

    var title = $(this).text();
    var link = $(element).children().attr('href')

    result.push({
      title: title,
      link: link
    })

    });
  console.log(result);
});

// app.listen(PORT, function() {
//   console.log("Listening at %s", PORT);
// });
