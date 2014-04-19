var express = require('express');
var app = express();
var port = process.env.PORT || 8001;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({secret: 'haha'}));
app.use(passport.initialize());
app.use(passport.session());

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GOOGLE_CLIENT_ID = '722616182555.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = 'Pq_g6ainldkNMtYpig7RRQW9';

passport.serializeUser(function(user, done){
	done(null, user);
})

passport.deserializeUser(function(obj, done){
	done(null, obj);
})

passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: 'http://gstapp.herokuapp.com/auth/google/callback'
	},
	function(accessToken, refreshToken, profile, done){
		process.nextTick(function(){
			return done(null, profile);
		});
	}
));


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index', {user: req.user});
});

app.get('/account', ensureAuthenticated, function(req, res){
	res.render('account',{user: req.user});
});

app.get('/login', function(req, res){
	res.render('login', {user: req.user});
});

app.get('/auth/google', 
	passport.authenticate('google', 
		{scope: ['https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email']
		}
	),
	function(req, res){

	}
);

app.get('/auth/google/callback', 
	passport.authenticate('google', 
		{failureRedirect: '/login'}),
	function(req, res){
		res.redirect('/');
	}
);

app.listen(port);
console.log('The magic happens on port ' + port);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

