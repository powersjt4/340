var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.use(express.static('public'));
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
  mysql.pool.query("DROP TABLE IF EXISTS `menu`;");
  mysql.pool.query("CREATE TABLE `menu` (`id` int(11) NOT NULL AUTO_INCREMENT,`restaurant_name` varchar(255) NOT NULL, `menu_meal` int(11) NOT NULL, PRIMARY KEY (`id`), KEY `menu_meal` (`menu_meal`), CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`menu_meal`) REFERENCES `meal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;");
  res.render('addmenus');
});

app.post('/insertmenu', function(req,res){
var context = {};
var postData = req.body;
  mysql.pool.query("INSERT INTO workouts(`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)", [postData.name, postData.reps, postData.weight, postData.date, postData.lbs], function(err, result,next){
    if(err){
      return;
    }
  postData.id = result.insertId;//Need to get ID from last insert
  //console.log(postData);
  res.send(postData);
  });
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
