"use strict";

let express = require("express"),
	bodyParser = require("body-parser"),
	User = require("./modules/save_users.js"),
	cookieParser = require("cookie-parser"),
	expressSession = require("express-session"),
	passport = require("passport"),
	mongoose = require("mongoose"),
	format = require("util").format,
	flash    = require("connect-flash"),
	LocalLoginStrategy = require("passport-local").Strategy,
	mymodule = require("./modules/my_module.js").ensureAuthenticated,
	app = express(),
	request = require("request");
	let assert = require("assert");

	let port = process.env.PORT || 8080
	
//session 
let tweet = "How is it going?";
let originalLang = "en";
let transLang = "ru";

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
//////////////////////////////////////////////////////////////////////////////

var mongoOptions =
{
	"mongos": null,
    "db": {
		"safe": true,
		"raw": true
		},
    "server": {
		
		"auto_reconnect": true,
        "poolSize": 10,
            "reconnectTries": 86400,
            "reconnectInterval": 1000,
        "socketOptions": {
                "noDelay": true,
                "connectTimeoutMS": 30000,
                "keepAlive": 1,
                "socketTimeoutMS": 0
            }
    }
};

mongoose.connect('mongodb://add your own api here');// add your own in here

app.set("view engine", "pug");
app.use(express.static("static"));


app.use(cookieParser());
app.use(bodyParser()); // get information from html forms


//**************Passport********************************************
// Setup Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport
passport.use('local-login', new LocalLoginStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 
        // find user whose email is the same as the forms email, check to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            return done(null, user);
        });
    }));

 passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-signup', new LocalLoginStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
   },
    function(req, email, password, done) {
        process.nextTick(function() {
        //check whether existing user
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                var newUser            = new User();
                // save new
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });    
        });
    }));

app.use(expressSession({ secret: 'welcome' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); // use connect-flash for flash messages stored in session

//***********Twitter**********************************************************
let tweetext = [];
let cleanTweets = [];
let tweetlength;

let Twitter = require("twitter"),
	client = new Twitter({
		consumer_key: 'add your own here',
		consumer_secret: 'add your own here',
		access_token_key: 'add your own here',
		access_token_secret: 'add your own here'
	})

client.get('search/tweets', {q: "#earlgrey"}, function(error, tweets, response) {
	tweetlength = tweets.statuses.length;
    if (!error) {
       for(let i = 0; i < tweets.statuses.length; i++){
         console.log(tweets.statuses[i].user.screen_name);
         console.log(tweets.statuses[i].text);
		 console.log(tweets.statuses[i].lang);
		 tweetext.push(tweets.statuses[i].text);
		 cleanTweets.push(tweets.statuses[i].text.replace(/#/g, ""));
       }
	   console.log(tweetext);
	   console.log(tweetlength);
	   console.log(cleanTweets);
	   for(let j = 0; j < tweets.statuses.length; j++){
		   
	   }
     }
   });
//*********************************************************************

app.get("/", function(req, res){
	res.render("index");
})

 
app.get("/login", function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render("index", { message: req.flash('loginMessage') }); 
    });


app.post("/login", passport.authenticate("local-login", {
	successRedirect : "/user", 
    failureRedirect : "/login",
    failureFlash : true // this is for flash messages
}));
/*
let translatefunc = function(detectedlan, fromthis){
	
}
*/
app.get("/register", function(req, res) {
	res.render("register", { message: req.flash('signupMessage') });
});
app.post("/register", passport.authenticate('local-signup', {
        successRedirect : "/user", 
        failureRedirect : "/register", 
        failureFlash : true
    }));

	
app.get("/user", mymodule, function(req, res){
  let csslinktranslated = '/css/translate1.css';
  //let showusername = User.local.email
  
  res.render("user",{
	  //user: showusername,
	  tweetlength: tweetlength,
	  csslink: csslinktranslated,
	  thetweets: tweetext,
	  thetweetstwo: cleanTweets
  });
  
}); 
	
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

//***************************translation from here*******************************************
let newertexts = [];
let translatedTweets = [];

for(let k = 0; k < tweetlength; k++){
	translateTweets.push("");
}

app.post("/translate", function(req, res){
	let waiting = 0;
	let csslinktranslated = '/css/translate1.css';
	originalLang = req.query.orig;
    transLang = req.query.trans;
	for(let k = 0; k < tweetlength; k++){
		tweet = cleanTweets[k];
		request.post("add your own yandexapi here" + tweet + "&lang=" + originalLang + "-" + transLang, function(err, response){
			
				console.log(JSON.parse(response.body).text[0]);
				translatedTweets[k] = JSON.parse(response.body).text[0];
				waiting++;
				if(waiting === tweetlength){
					res.send(translatedTweets);
				}
		});
		
	}
	console.log(translatedTweets);

});

app.get("/user_next", mymodule, function(req, res){
 
  res.render("user_next");
  
}); 

app.listen(port, function(){
  console.log("App running");
});


//tweets.statuses[i].lang will return the language code of the tweet.