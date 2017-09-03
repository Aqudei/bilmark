var mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1/bilmark', { useMongoClient: true });

module.exports = mongoose;