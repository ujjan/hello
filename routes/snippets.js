/**
 * Created by Ayaz on 2016-12-01.
 */
//const bodyParser = require('body-parser');
//const express = require('express');
let router = require("express").Router();
let Snip = require("../models/Snip");
const _ = require('lodash');
var  {User} = require('../models/User');
var {authenticate} = require('../middleware/authenticate.js');


module.exports = function(app) {


    app.get('/', (req, res) => {

        // res.send('<h1>Hello Express!</h1>');
        res.render("home/home.hbs", {
            title: "Home PAge",
            pageTitle: "This is Home PAge",
            welcomeMessage: "Hello this is really working i think"

        })
    });
    // Create the user
    app.post('/users', (req, res)=> {
        var body = _.pick(req.body, ['email', 'password']);
        var user = new User(body);

        user.save().then(()=> {

            return user.generateAuthToken();
           // res.send(user);
            console.log(user)
        }).then((token)=>{
            res.header('x-auth', token).send(user);

        }).catch((e)=> {
            res.status(400).send(e)
        });
    });


    app.get('/about', (req, res) => {

        Snip.find({}, function (error, data) {

            // mapping up the object for the view
            let context = {
                snippets: data.map(function (snip) {
                    return {
                        name: snip.name,
                        snippets: snip.snippets,
                        id: snip._id
                    };
                }),
            };
            console.log(context);
            req.session.flash = {
                type: "success",
                message: "The post was deleted!"
            };
            res.render("snippets/about.hbs", context);
        });

    });


    app.get('/signup', (req, res)=> {
        res.render('snippets/signup.hbs', {
            pageTitle: 'Please SignUp'
        });

    });


    app.get('/about/create', (req, res)=> {
        res.render('snippets/create.hbs', {
            pageTitle: 'Please SignUp'
        });

    });
    app.post('/about/create', (req, res)=> {
        let name = req.body.name;
        let snippets = req.body.snippets;

        // Create the object to save
        let todo = new Snip({
            name: name,
            snippets: snippets
        });

        // Using a promise in this case

        todo.save().then(function () {


            // Successful
            req.session.flash = {
                type: "success",
                message: "The post was Created!"
            };
            res.redirect("/about");
        }).catch(function (error) {
            // get validation error for example
            console.log(error.message);

            // Of course you should handle this better!
            res.redirect("/todo");
        });
    });



    app.get('/users/me', authenticate, (req, res) => {
        res.send(req.user);
    });


    // Log in Rout

    app.get('/about/login', (req, res)=> {
        res.render('snippets/login.hbs', {
            pageTitle: 'Please SignIn'
        });

    });
    app.post('/about/login', (req, res)=> {
        let name = req.body.email
        let snippets = req.body.password;

        var body = _.pick(req.body, ['email', 'password']);

        User.findByCredentials(body.email, body.password).then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header('x-auth', token).send(user);

            });


        }).catch((e) => {
            res.status(400).send();
        });
    });

    app.delete('/about/logout', authenticate, (req, res) => {
        req.user.removeToken(req.token).then(() => {
            res.status(200).send();
        }, () => {
            res.status(400).send();
        });
    });



}












    //===================================================================


/*
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




app.get('/', (req, res) => {

    // res.send('<h1>Hello Express!</h1>');
    res.render("home/home.hbs", {
        title: "Home PAge",
        pageTitle: "This is Home PAge",
        welcomeMessage: "Hello this is really working i think"

    })
});





app.get('/about', (req, res) => {

    Snip.find({}, function(error, data) {

        // mapping up the object for the view
        let context = {
            snippets: data.map(function(snip) {
                return {
                    name: snip.name,
                    snippets: snip.snippets,
                    id: snip._id
                };
            }),
        };
        console.log(context);
        req.session.flash = {
            type: "success",
            message: "The post was deleted!"
        };
        res.render("snippets/about.hbs", context);
    });

});

// Create the user
app.post('/users', (req, res)=>{
    var body = _.pick(req.body,['email', 'password']);
    var user = new User(body);
    console.log(req.body)
    user.save().then((user)=>{

        res.send(user);

    }).catch((e)=>{
        res.status(400).send(e)
    });
});



app.get('/login', (req, res)=>{
    res.render('snippets/login.hbs',{
        pageTitle: 'Please SignUp'
    });

});




app.get('/about/create', (req, res)=>{
    res.render('snippets/create.hbs',{
        pageTitle: 'Please SignUp'
    });

});
app.post('/about/create',(req, res)=> {
    let name = req.body.name;
    let snippets = req.body.snippets;

    // Create the object to save
    let todo = new Snip({
        name: name,
        snippets: snippets
    });

    // Using a promise in this case

    todo.save().then(function() {


        // Successful
        req.session.flash = {
            type: "success",
            message: "The post was Created!"
        };
        res.redirect("/about");
    }).catch(function(error) {
        // get validation error for example
        console.log(error.message);

        // Of course you should handle this better!
        res.redirect("/todo");
    });
});
}

 */