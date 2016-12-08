/**
 * Created by Ayaz on 2016-12-01.
 */


let router = require("express").Router();
let Snip = require("../models/Snip");

app.get('/', (req, res) => {

    // res.send('<h1>Hello Express!</h1>');
    res.render("snippets/home.hbs", {
        title: "Home PAge",
        pageTitle: "This is Home PAge",
        welcomeMessage: "Hello this is really working i think"

    })
});



app.get('/about', (req, res) => {

    // res.send('<h1>Hello Express!</h1>');
    res.render("snippets/about.hbs", {
        title: "About PAge",
        pageTitle: "This is  all about ABOUT page",
        welcomeMessage: "Hello "

    })
});


app.get('/login', (req, res)=>{
    res.render('snippets/login.hbs',{
        pageTitle: 'Please SignUp'
    });

});


app.use(bodyParser.json());

app.get('/about/create', (req, res)=>{
    res.render('snippets/create.hbs',{
        pageTitle: 'Please Create the snippets'
    });

}).post(function(request, response) {
    let nameText = request.body.nameText;
    let snippetsText = request.body.snippetsText;

    // Create the object to save
    let snippets = new Snip({
        name: nameText,
        snippets: snippetsText
    });

    // Using a promise in this case
    snippets.save().then(function() {
        // Successful
        response.redirect("/about");
    }).catch(function(error) {
        // get validation error for example
        console.log(error.message);

        // Of course you should handle this better!
        response.redirect("/about");
    });
});
