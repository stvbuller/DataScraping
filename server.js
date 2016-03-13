//express setup
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//request setup
var request = require('request');
//cheerio setup
var cheerio = require('cheerio');

//morgan setup
var logger = require('morgan');

//middleware init
app.use("/jscripts", express.static("public/jscripts"));
app.use("/css", express.static("public/css"));
app.use(logger('dev'));

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

//mongoose setup
var mongoose = require('mongoose');

//mongoose database configuration
mongoose.connect('mongodb://localhost/scraper');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

//require mongoose schemas
var ScrapedData = require('./models/scrapedDataModel.js');
var Note = require('./models/noteModel.js');

//mongojs database configuration
// var mongojs = require('mongojs');
// var databaseUrl = "scraper";
// var collections = ["scrapedData"];
// var db = mongojs(databaseUrl, collections);
// db.on('error', function(err) {
//   console.log('Database Error:', err);
// });

//routes
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
  //res.sendfile('./views/index.html');
});

//scrape data and save to database
app.get('/scrape', function(req, res) {
  request('https://www.reddit.com/', function (error, response, html) {
    var $ = cheerio.load(html);
    var result = [];
    $(".title").each(function(i, element){

      //scrape some stuff, put it in an object

      var title = $(this).text();
      var link = $(element).children().attr('href');

      if (title && link) {
        var newScrapedData = new ScrapedData({title:title, link:link});
        //mongoose save data
        newScrapedData.save(function(err, doc) {
          if (err) {
            console.log(err)    //res.send(err);
          } else {
            console.log(doc)    //res.send(doc);
          }
        });
        //mongojs save data
        // db.scrapedData.save({
        //   title: title,
        //   link: link
        // }, function(err, saved) {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     console.log(saved);
        //   }
        // });   //end of mongo js save data
      }
    });
  });
  res.send("Scrapped saved");
});

//get data from the database
app.get('/getItems', function(req, res) {
  //mongoose find data
  ScrapedData.find({}, function(err, dbResults) {
    if (err) {
      res.send(err);
    } else {
      res.send(dbResults);
    }
  });
  //mongojs find data
  // db.scrapedData.find(function (err, dbResults) {
  // dbResults is an array of all the documents in scrapedData
  //   if(err) {
  //     throw err;
  //   }
  //   res.json(dbResults);
  // })
});

//delete all data from the database
app.get('/deleteAll', function(req, res) {
  //mongoose drop collection
  ScrapedData.remove({}, function(err, dbResults) {
    if (err) {
      res.send(err);
    } else {
      res.send(dbResults);
    }
  });
  //mongojs drop collection
  // db.scrapedData.drop(function (err, dbResults) {
  // // dbResults is an array of all the documents in scrapedData
  //   if(err) {
  //     throw err;
  //   }
  //   res.json(dbResults);
  // })
});

//delete an item from the database
app.get("/delete/:id", function(req, res){
  var id = req.params.id;
  ScrapedData.remove({_id:id}, function(err, dbResults){
    if(!err){
      res.send("success");
    }
    else{
      res.send("fail");
    }
  });
});

app.post('/submit', function(req, res) {
  var newNote = new Note(req.body);

  //Save the new note
    newNote.save(function(err, doc) {
      if (err) {
        res.send(err);
      } else {

    //Find the scraped data item and push the new note id into the item's notes array
      ScrapedData.findOneAndUpdate({}, {$push: {'notes': doc._id}}, {new: true}, function(err, doc) {
        if (err) {
          res.send(err);
        } else {
          console.log(doc)   //res.send(doc);
        }
      });
    }
  });
});

app.listen(PORT, function() {
  console.log("Listening at %s", PORT);
});
