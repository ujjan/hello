    "use strict";

/*
    var mongoose = require('mongoose');

    mongoose.Promise= global.Promise;
    mongoose.connect('mongodb://localhost:27017/SniopApp');

    module.exports = {mongoose};

*/

    let mongoose     = require("mongoose");
    mongoose.Promise = global.Promise;
    module.exports = {
        initilize : function() {
          // reed db Configuration
          let dbConfig = require("../config/database.js");
          let db = mongoose.connection;


          // mayby should remove out from this file - EventEmitters?
          db.on("error", console.error.bind(console, "connection error:"));

          db.once("open", function() {
            console.log("Succesfully connected to mongoDB");
          });

          // If the Node process ends, close the Mongoose connection.
          process.on("SIGINT", function() {
                db.close(function() {
                   console.log("Mongoose connection disconnected through app termination.");
                  process.exit(0);
              });
          });

          // Connect to the database.
          mongoose.connect(dbConfig.connectionString);
        }
    };

