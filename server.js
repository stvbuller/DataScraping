//express setup
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

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

//database configuration
var mongojs = require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedData"];
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

//routes
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//scrape data and save to database
app.get('/scrape', function(req, res) {
  request('https://www.reddit.com/', function (error, response, html) {
    var $ = cheerio.load(html);
    //var result = [];
    $(".title").each(function(i, element){

      //scrape some stuff, put it in an object and add it to the result array

      var title = $(this).text();
      var link = $(element).children().attr('href');

      if (title && link) {
        db.scrapedData.save({
          title: title,
          link: link
        }, function(err, saved) {
          if (err) {
            console.log(err);
          } else {
            console.log(saved);
          }
        });
      }
    });
  });
  res.send("Scrapped saved");
});

//get data from the database
app.get('/getItems', function(req, res) {
  db.scrapedData.find(function (err, dbResults) {
  // dbResults is an array of all the documents in scrapedData
    if(err) {
      throw err;
    }
    res.json(dbResults);
  })
});

//delete al data from the database
app.get('/deleteAll', function(req, res) {
  db.scrapedData.drop(function (err, dbResults) {
  // dbResults is an array of all the documents in scrapedData
    if(err) {
      throw err;
    }
    res.json(dbResults);
  })
});

//delete an item from the database
app.get("/delete/:id", function(req, res){
  var id = req.params.id;
  db.scrapedData.remove({_id:id}, function(err, doc){
    if(!err){
      res.send("success");
    }
    else{
      res.send("fail");
    }
  });
});

app.listen(PORT, function() {
  console.log("Listening at %s", PORT);
});
