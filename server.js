var express = require('express'),

app = express(),

port = process.env.PORT || 3000,

mongoose = require('mongoose'),

User = require('./api/models/user'),

bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://mongo:27017/UniNote', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("MongoDB Connected");
  });


//app.use(bodyParser.urlencoded({ extended: true }));

//app.use(bodyParser.json());

var routes = require('./api/routes/user');

routes(app);

app.listen(port);

console.log('RESTful API server started on: ' + port);