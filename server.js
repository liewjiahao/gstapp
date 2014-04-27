var express = require('express');
var app = express();
var port = process.env.PORT || 8001;
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'usen'
});

var PDFDocument = require('pdfkit');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var exphbs  = require('express3-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'haha'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	done(null, obj);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
	var queryString = "select * from user where username ='"+username+"'"; 
    connection.query(queryString, function(err, user) {    
		if (err || user.length == 0) { console.log(err); return done(err); } // error or no row
		if (!user) {
			return done(null, false, { message: 'Incorrect username.' });			
		}
		if (user[0].password != password) {
			return done(null, false, { message: 'Incorrect password.' });
		}
		return done(null, user[0]);		
    });
  }
));

// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var GOOGLE_CLIENT_ID = '722616182555.apps.googleusercontent.com';
// var GOOGLE_CLIENT_SECRET = 'Pq_g6ainldkNMtYpig7RRQW9';

// passport.use(new GoogleStrategy({
// 	clientID: GOOGLE_CLIENT_ID,
// 	clientSecret: GOOGLE_CLIENT_SECRET,
// 	callbackURL: 'https://gstapp.herokuapp.com/auth/google/callback'
// 	},
// 	function(accessToken, refreshToken, profile, done){
// 		process.nextTick(function(){
// 			return done(null, profile);
// 		});
// 	}
// ));

// app.get('/auth/google', 
// 	passport.authenticate('google', 
// 		{scope: ['https://www.googleapis.com/auth/userinfo.profile',
// 			'https://www.googleapis.com/auth/userinfo.email']
// 		}
// 	),
// 	function(req, res){

// 	}
// );

// app.get('/auth/google/callback', 
// 	passport.authenticate('google', 
// 		{failureRedirect: '/login'}),
// 	function(req, res){
// 		res.redirect('/');
// 	}
// );

// app.use(express.static(__dirname + '/public'));

app.get('/login', function(req, res){
	//res.render('login', {user: req.user});
	res.sendfile(__dirname + '/public/login.html')
});

app.post('/login', 
	passport.authenticate('local', { successRedirect: '/', 
		failureRedirect: '/login', 
		failureFlash: true 
	})
);

app.get('/logout', function(req, res){
	req.logOut();
	res.redirect('/login');
});

app.get('/js/:jsfile', function(req, res){
	res.sendfile(__dirname + '/js/' + req.params.jsfile);
});

app.get('/pdf/:pdffile', ensureAuthenticated, function(req, res){
	res.sendfile(__dirname + '/pdf/' + req.params.pdffile);
});

app.get('/user', ensureAuthenticated, function(req, res){
	res.json(req.user);
});

app.get('/clients', ensureAuthenticated, function(req, res){
	var queryString = "select * from client"; 
	connection.query(queryString, function(err, rows) {
		if (err) { throw err; }
		res.json(rows);		
	});		
});

app.get('/', function(req, res){
	res.sendfile(__dirname + '/public/index.html');	
});

app.get('/public/:htmlfile', function(req, res){
	res.sendfile(__dirname + '/public/' + req.params.htmlfile);	
});

app.post('/noc', function(req, res){

  var client_name = req.body.client_name;
  var address_line_1 = req.body.address_line_1;
  var address_line_2 = req.body.address_line_2;
  var address_line_3 = req.body.address_line_3;
  var address_line_3 = req.body.address_line_3;
  var noc_no = req.body.noc_no || '';
  var noc_date = req.body.noc_date || '';
  var noc_agent = req.body.noc_agent || '';
  var noc_desc_1 = req.body.noc_desc_1 || '';
  var noc_desc_2 = req.body.noc_desc_2 || '';
  var noc_desc_3 = req.body.noc_desc_3 || ''; 
  var noc_desc_4 = req.body.noc_desc_4 || '';
  var noc_desc_5 = req.body.noc_desc_5 || '';
  var noc_desc_6 = req.body.noc_desc_6 || '';
  var noc_amount_1 = req.body.noc_amount_1 || '';
  var noc_amount_2 = req.body.noc_amount_2 || '';
  var noc_amount_3 = req.body.noc_amount_3 || '';
  var noc_amount_4 = req.body.noc_amount_4 || '';
  var noc_amount_5 = req.body.noc_amount_5 || '';
  var noc_amount_6 = req.body.noc_amount_6 || '';

  var noc_amount_total = noc_amount_1 + noc_amount_2 + noc_amount_3 + noc_amount_4 + noc_amount_5 + noc_amount_6;

  var doc = new PDFDocument({margins: { top: 72, bottom: 72, left: 72, right: 72 }, size: 'A4'});
  doc.font('Helvetica').fontSize(11);
  var filename = 'pdf/noc_' + random16() + '.pdf';

  t = client_name; // XXX SDN. BHD. 
  doc.font('Helvetica-Bold').text(t,72,132, {width: 268, height: 13});
  t = address_line_1; // 12, Jalan 123
  doc.font('Helvetica').text(t,72,145);
  t = address_line_2; // Taman ABC
  doc.text(t,72,158);
  t = address_line_3; // 52100 Kuala Lumpur
  doc.text(t,72,171);

  t = 'NOTICE OF CHARGE'; // NOTICE OF CHARGE
  doc.font('Helvetica-Bold').fontSize(18).text(t,340,126);
  t = 'NO'; // NO
  doc.font('Helvetica').fontSize(11).text(t,364,145);
  t = noc_no; // 00005
  doc.text(t,412,145);
  t = 'DATE'; // DATE
  doc.text(t,364,158);
  t = noc_date; // DD/MM/YYYY
  doc.text(t,412,158);  
  t = 'AGENT'; // AGENT
  doc.text(t,364,171);
  t = noc_agent; // MAGDALENE
  doc.text(t,412,171);  


  doc.moveTo(72,206).lineTo(523,206).stroke(); // -----------------------
  t = 'DESCRIPTION'; // DESCRIPTION
  doc.font('Helvetica-Bold').text(t,72,210);
  t = 'AMOUNT'; // AMOUNT
  doc.text(t,412,210);
  doc.moveTo(72,225).lineTo(523,225).stroke(); // -----------------------

  t = noc_desc_1;
  doc.font('Helvetica').text(t,72,242);
  t = noc_amount_1;
  doc.text(t,412,242);

  t = noc_desc_2;
  doc.text(t,72,268);
  t = noc_amount_2;
  doc.text(t,412,268);

  t = noc_desc_3;
  doc.text(t,72,294);
  t = noc_amount_3;
  doc.text(t,412,294);

  t = noc_desc_4;
  doc.text(t,72,320);
  t = noc_amount_4;
  doc.text(t,412,320);

  t = noc_desc_5;
  doc.text(t,72,346);
  t = noc_amount_5;
  doc.text(t,412,346);

  t = noc_desc_6;
  doc.text(t,72,372);
  t = noc_amount_6;
  doc.text(t,412,372);

  doc.moveTo(72,636).lineTo(523,636).stroke(); // ---------------------
  t = 'For and on behalf of'; // For and on behalf of
  doc.text(t,72,653);
  t = 'COLOR MAGNET MANAGEMENT'; // COLOR MAGNET MANAGEMENT
  doc.text(t,72,666);

  doc.moveTo(72,740).lineTo(219,740).stroke(); // ________________
  t = 'Authorized Signature(s)'; // Authorized Signature(s)
  doc.text(t,72,744);

  t = 'TOTAL           RM'; // TOTAL    RM
  doc.font('Helvetica-Bold').text(t,298,653);
  t = noc_amount_total; // 3800.00
  doc.text(t,412,653);  
  doc.moveTo(294,649).lineTo(468,649).stroke(); // ---------------------
  doc.moveTo(294,668).lineTo(468,668).stroke(); // ---------------------
  doc.moveTo(294,649).lineTo(294,668).stroke(); // |
  doc.moveTo(468,649).lineTo(468,668).stroke(); // |
  t = 'For direct bank-in, please issue cheque to'; // For direct bank-in, please issue cheque to
  doc.font('Helvetica').text(t,298,679);
  t = 'Payee: COLOR MAGNET MANAGEMENT';
  doc.text(t,298,692);
  t = 'A/C No: 514879069016';
  doc.text(t,298,705);
  t = 'Bank: Maybank';
  doc.text(t,298,718);
  t = 'Please inform us after you have banked in.';
  doc.text(t,298,744);
  t = 'Thank you.';
  doc.text(t,298,757);
  
  var r = doc.pipe(fs.createWriteStream(filename));
  r.on('close', function(){
    res.send(filename);        
  });  
  doc.end();

});

app.listen(port);
console.log('The magic happens on port ' + port);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function random16(){
  return "1234567890123456".split('').map(function(){return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62*Math.random()));}).join('');
}