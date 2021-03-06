  const express = require('express');
  const hbs = require("hbs");
  const fs = require('fs');
  const bodyParser = require('body-parser');
  const _ = require('lodash');
  let session      = require("express-session");


  var db = require('./libs/dbHelper');
  let exphbs       = require("express-handlebars");
  db.initilize();
  var  Snip = require('./models/Snip');
  var  User = require('./models/User');

  var app = express();
  const port = process.env.PORT || 4000;
  app.use(bodyParser.json());

  hbs.registerPartials(__dirname +"/views/partials")
  app.set("view engine", "hbs");

  // Add support for handling HTML form data
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(session({
    name:   "theserversession",  // Don't use default session cookie name.
    secret: "K7smsx9MsEasad89wEzVp5EeCep5s", // should be kept secret
    saveUninitialized: false, // save/or not save a created but not modified session
    resave: false, // resave even if a request is not changing the session
    cookie: {
      secure: false, // should be true to check that we´re using HTTPS - Im not in this case
      httpOnly: true, // dont allow client script messing with the cookie
      maxAge: 1000 * 60 * 60 * 24 // will live for 1 day
    }
  }));

  // Adding support for flash messages through the middleware pattern
  app.use(function(request, response, next) {
    // The flash should live for one roundtrip so if it is set in the session
    // add it to the context (this request through locals)
    if(request.session.flash) {
      response.locals.flash = request.session.flash;
      // then delete it from the session
      delete request.session.flash;
    }
    next();
  });

  /*
  app.use( (req, res, next) => {
    res.render("maintenence.hbs", {
      pageTitle: "We are Sorry to keep you wait ...",
      mesagee: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
    })
  });

  */
  app.use(bodyParser.json());
  app.use(express.static(__dirname +"/public"));

  hbs.registerHelper("getCurrentYear", ()=>{

    return new Date().getFullYear();
  });

  hbs.registerHelper("screamIt", (text)=>{

    return text.toUpperCase();
  });

  app.engine(".hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs"
  }));
  app.set("view engine", ".hbs");


  app.use(session({
    name:   "theserversession",  // Don't use default session cookie name.
    secret: "K7smsx9MsEasad89wEzVp5EeCep5s", // should be kept secret
    saveUninitialized: false, // save/or not save a created but not modified session
    resave: false, // resave even if a request is not changing the session
    cookie: {
      secure: false, // should be true to check that we´re using HTTPS - Im not in this case
      httpOnly: true, // dont allow client script messing with the cookie
      maxAge: 1000 * 60 * 60 * 24 // will live for 1 day
    }
  }));

  // Adding support for flash messages through the middleware pattern
  app.use(function(request, response, next) {
    // The flash should live for one roundtrip so if it is set in the session
    // add it to the context (this request through locals)
    if(request.session.flash) {
      response.locals.flash = request.session.flash;
      // then delete it from the session
      delete request.session.flash;
    }
    next();
  });


   var snippets = require('./routes/snippets.js')(app);

  /*

  app.post('/create', (req, res) => {

    var todo = new Snip({
      name: req.body.text,
      snippets: req.body.snippets

    });

    todo.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });

*/

  app.use("/users/", require("./routes/users.js"));



  // /bad - send back json with errorMessage
  app.get('/bad', (req, res) => {
    res.send({
      errorMessage: 'Unable to handle request'
    });
  });

  app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
  });

