var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.use(express.static('./views/images')); 
app.use('/menus/', express.static('./views/images'));
app.use(express.static('views/css'));
app.set('view engine', 'handlebars');
app.set('port', 3000);

/*Navigation*/
app.get('/',function(req,res){
  res.render('home');
});

app.get('/additems',function(req,res){
  res.render('additems');
});

app.get('/addmenus',function(req,res){
  res.render('addmenus');
});

app.get('/additemstomenu',function(req,res){
  res.render('additemstomenu');
});

app.get('/viewdb',function(req,res){
  res.render('viewdb');
});

app.get('/',function(req,res){
	res.render('home');
});

/*Error renders*/
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
