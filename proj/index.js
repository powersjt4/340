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
    mysql.pool.query("INSERT INTO meal(`name`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",[postData.menu_meal], function(err, result,next){
         if(err){
         console.log("Error Adding to meal type table" + JSON.stringify(postData));
         return;
        }
		console.log(postData);
        postData.menu_meal = result.insertId; // Sets menu_meal to LAST_INSET_ID
		console.log(postData);
        mysql.pool.query("INSERT INTO menu(`restaurant_name`,`menu_meal`) VALUES (?,?)", [postData.restaurant_name, postData.menu_meal], function(err, result,next){
            if(err){
             console.log("Error Adding to menu table" + JSON.stringify(postData));
             return;
            }
          postData.id = result.insertId;//Need to get ID from last insert
          console.log(JSON.stringify(postData));
          res.send(postData);
        });
    });
});///insertmenu

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

app.get('/selectMenu',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
  context = result;
  res.send(context);
  });
});

app.post('/updateMenu', function(req,res,next){
  var postData = req.body;

  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [postData.id], function(err, result){
    if(err){
      next(err);
      return;
    }
//  if(result.length == 1){
      var curVals = result[0];
    mysql.pool.query("UPDATE workouts SET name=?, reps =?, weight=?, date=?,lbs=?WHERE id=? ",
        [postData.rName || curVals.name, postData.reps || curVals.reps, postData.weight || curVals.weight,postData.date ||curVals.date, postData.lbs || curVals.lbs, postData.id],
        function(err, result){
        if(err){
          return;
        }
        results = "Updated " + result.changedRows + " rows.";
        res.send(results);
      });
//  }
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
mysql.pool.query("INSERT INTO meal(`name`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",[postData.item_meal], function(err, result,next){
         if(err){
         console.log("Error Adding to item meal type table" + JSON.stringify(postData));
         return;
        } 
		console.log(postData);
        postData.item_meal = result.insertId; // Sets itemu_meal to LAST_INSET_ID
		console.log(postData);
mysql.pool.query("INSERT INTO item(`name`,`description`,`price`,`item_meal`,`primary_ingredient`) VALUES (?,?,?,?,?)", [postData.name, postData.description, postData.price, postData.item_meal, postData.primary_ingredient], function(err, result,next){
            if(err){
             console.log("Error Adding to item table" + JSON.stringify(postData));
             return;
            }
          postData.id = result.insertId;//Need to get ID from last insert
          console.log(JSON.stringify(postData));
          res.send(postData);
        });
    });
});

app.get('/deleteItem/:id',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM item WHERE id=?", [req.params.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results;
    res.send(context);
  });
});

/*///Additemstomenu///*/

/* get resaurant names to populate in dropdown */
function getRestaurant(res, mysql, context, complete){
	mysql.pool.query("SELECT menu.id, menu.restaurant_name, meal.name AS meal_name FROM menu INNER JOIN meal ON menu.menu_meal = meal.id ", function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.restaurants = results;
		complete();
	});
}

app.get('/additemstomenu',function(req,res){
    var callbackCount = 0;
    var context = {};
    getRestaurant(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
				res.render('additemstomenu', context);
            }
		};
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
