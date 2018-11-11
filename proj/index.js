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
app.set('port', 4576);

/*///Navigation///*/
app.get('/',function(req,res){
  res.render('home');
});

/*///MENUS///*/
app.get('/addmenus',function(req,res){
  res.render('addmenus');
});

app.get('/getMenuDB',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM menu', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context = rows;
    res.send(context);
  });
});


app.post('/insertmenu', function(req,res){
var context = {};
var postData = req.body;
console.log(postData);
mysql.pool.query("INSERT INTO menu(`restaurant_name`,`menu_meal`) VALUES (?,?)", [postData.restaurant_name, postData.menu_meal], function(err, result,next){
    if(err){
     console.log("Error Adding to menu table" + postData);
     return;
    }
  postData.id = result.insertId;//Need to get ID from last insert
  console.log(postData);
  res.send(postData);
  });
});

app.get('/deleteMenu/:id',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM menu WHERE id=?", [req.params.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results;
    res.send(context);
  });
});


/*///ITEMS///*/
app.get('/additems',function(req,res){
  res.render('additems');
});

app.get('/getItemDB',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM item', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context = rows;
    res.send(context);
  });
});

app.post('/insertitem', function(req,res){
var context = {};
var postData = req.body;
console.log(postData);
mysql.pool.query("INSERT INTO item(`name`,`description`,`price`,`item_meal`,`primary_ingredient`) VALUES (?,?,?,?,?)", [postData.name, , postData.description, postData.price, postData.item_meal, postData.primary_ingredient], function(err, result,next){
    if(err){
     console.log("Error adding to item table" + postData);
     return;
    }
  postData.id = result.insertId;//Need to get ID from last insert
  console.log(postData);
  res.send(postData);
  });
});

/*///Additemstomenu///*/
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
