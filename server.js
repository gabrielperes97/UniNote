var express = require('express'),

app = express(),

consign = require("consign"),

mongoose = require('mongoose'),

morgan = require('morgan'),

User = require('./api/models/user'),

bodyParser = require('body-parser');

config = require('./configs/'+ (process.env.NODE_ENV || "dev") + ".json");

auth = require("./configs/auth")();

port = config.port || 3000;

mongoose.Promise = global.Promise;

mongoose.connect(config.DBHost, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("MongoDB Connected");
});

if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(auth.initialize());

var userRoutes = require('./api/routes/user');
userRoutes(app);

var tokenRoutes = require('./api/routes/token');
tokenRoutes(app);

app.listen(port);

consign({cwd: 'server'})
  .include("api/models")
  .include("api/controllers")
  .then("api/routes")
  .into(app)

console.log('RESTful API server started on: ' + port + " using "+ process.env.NODE_ENV + " profile");

module.exports = app;