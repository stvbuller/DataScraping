var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScrapedDataSchema = new Schema({
  title: {
    type:String
  },
  link: {
    type:String
  }
});

var ScrapedData = mongoose.model('ScrapedData', ScrapedDataSchema);
module.exports = ScrapedData;
