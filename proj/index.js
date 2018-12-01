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
if(process.argv[2]=== undefined){
  app.set('port', 4576);
} else {
  app.set('port', process.argv[2]);
}
/*Home*/
app.get('/',function(req,res){
  res.render('home');
});

/*///MENUS///*/
app.get('/addmenus',function(req,res){
    var context = {};
    mysql.pool.query('SELECT * FROM meal', function(err, mealResults, fields){
      if(err){
        next(err);
        return;
      }
      context.mealResults = mealResults;
      res.render('addmenus',context);
    });
});

app.get('/getMenuDB',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT menu.id, menu.restaurant_name, meal.name AS menu_meal FROM menu INNER JOIN meal ON menu.menu_meal = meal.id', function(err, menuResults, fields){
    if(err){
      next(err);
      return;
    }
    context.menuResults = menuResults;
    res.send(context);
  });
});

/*Insert new menu checks to see if meal name alreadty exists if it doesn't it will add the name to the meal database,
 *if not it will return the if of the unique meal id. menu_mealString is the string name entered by the user(meal.name)
 *and menu meal is the id of the meal for entry into menu. 
 */
app.post('/insertmenu', function(req,res){
  var context = {};
var postData = req.body;
  mysql.pool.query("INSERT INTO menu(`restaurant_name`,`menu_meal`) VALUES (?,?)", [postData.restaurant_name, postData.menu_meal], function(err, insertResult,next){
      if(err){
       console.log("Error Adding to menu table" + JSON.stringify(postData));
       return;
      }
    context.insertResult = insertResult;//Need to get ID from last insert
    sql = "SELECT menu.id, menu.restaurant_name, meal.name AS menu_meal FROM menu INNER JOIN meal ON menu.menu_meal = meal.id WHERE menu.restaurant_name=?"; 
    mysql.pool.query(sql,[postData.restaurant_name], function(err, selectResults){
       if(err){
        next(err);
        return;
      }
    context.selectResults = selectResults;
    res.send(context);
    });
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

app.get('/selectMenu',function(req,res,next){
  var context = {};
  sql = "SELECT menu.id, menu.restaurant_name, meal.name AS menu_meal, meal.id AS meal_id FROM menu INNER JOIN meal ON menu.menu_meal = meal.id WHERE menu.id=?";
//  mysql.pool.query("SELECT * FROM menu WHERE id=?", [req.query.id], function(err, result){
  mysql.pool.query(sql,[req.query.id], function(err, result){
     if(err){
      next(err);
      return;
    }
  context = result;
  res.send(context);
  });
});


function updateMenu(res, mysql, postData, context, complete){
  mysql.pool.query("UPDATE menu SET  restaurant_name = ? , menu_meal = ? WHERE id = ?;", [postData.restaurant_name, postData.menu_meal, postData.id], function(error, results){
    if(error){
      res.write(JSON.stringify(error));
      res.end();
    }
    context.selectedMeal = results;
    complete();
  });
}


app.post('/updateMenu', function(req,res,next){
  var postData = req.body;
  var callbackCount = 0;
  var context = {};
   updateMenu(res, mysql, postData, context,complete);
       function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.send(context);
            }
      }
});

/*///ITEMS///*/
app.get('/additems',function(req,res){
  res.render('additems');
});

app.get('/getItemDB',function(req,res,next){
  var context = {};
  sql = "SELECT i.id, i.name, i.price, i.description, m.name AS item_meal, pi.name AS primary_ingredient FROM item i INNER JOIN meal m ON i.item_meal = m.id INNER JOIN primary_ingredient pi ON i.primary_ingredient = pi.id;"
  mysql.pool.query(sql, function(err, rows, fields){
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
mysql.pool.query("INSERT INTO meal(`name`) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",[postData.item_meal], function(err, result,next){
         if(err){
         console.log("Error Adding to item meal type table" + JSON.stringify(postData));
         return;
        } 
        postData.item_meal = result.insertId; // Sets itemu_meal to LAST_INSET_ID
		mysql.pool.query("INSERT INTO item(`name`,`description`,`price`,`item_meal`,`primary_ingredient`) VALUES (?,?,?,?,?)", [postData.name, postData.description, postData.price, postData.item_meal, postData.primary_ingredient], function(err, result,next){
            if(err){
             console.log("Error Adding to item table" + JSON.stringify(postData));
             return;
            }
          postData.id = result.insertId;//Need to get ID from last insert
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

app.get('/getMenuItems/:id',function(req,res){
  var context = {};
  sql1 = "SELECT item.id, item.name, item.price, item.description, primary_ingredient.name AS primary_ingredient, meal.name AS item_meal FROM menu_items mi INNER JOIN menu ON mi.mid = menu.id INNER JOIN item ON mi.iid = item.id INNER JOIN meal ON item.item_meal = meal.id INNER JOIN primary_ingredient ON item.primary_ingredient = primary_ingredient.id WHERE mi.mid =?;";
  var inserts = [req.params.id];
  mysql.pool.query(sql1, inserts, function(error, results, fields){
    if(error){
        res.write(JSON.stringify(error));
        res.end()
    }
   context.menuItems = results;
    sql2 = "SELECT i.id, i.name, i.price, i.description, m.name AS item_meal, pi.name AS primary_ingredient FROM item i INNER JOIN meal m ON i.item_meal = m.id INNER JOIN primary_ingredient pi ON i.primary_ingredient = pi.id;"
    mysql.pool.query(sql2, function(err, results2, fields){
    if(err){
    next(err);
    return;
    }
   context.allItems = results2;
    res.send(context);
    });
  });
});

app.post('/addToMenu', function(req,res){
  var context = {itemToAdd: null, affectedRows: null};
  var postData = req.body;
  sql = "INSERT IGNORE INTO menu_items(mid,iid)VALUES(?,?);"
  var inserts = [postData.menu_id, postData.item_id];
  mysql.pool.query(sql, inserts, function(err, results, fields){
      if(err){
        next(err);
        return;
      }else if(results.affectedRows == 0){
       context.affectedRows = results.affectedRows;
        res.send(context);
      } else{
        sql = "SELECT i.id, i.name, i.price, i.description, m.name AS item_meal, pi.name AS primary_ingredient FROM item i INNER JOIN meal m ON i.item_meal = m.id INNER JOIN primary_ingredient pi ON i.primary_ingredient = pi.id WHERE i.id = ?;";
        mysql.pool.query(sql, [postData.item_id], function(err, results2, fields){
//        mysql.pool.query('SELECT * FROM item WHERE item.id = ?', [postData.item_id], function(err, results2, fields){
          if(err){
            next(err);
            return;
          }
          context.itemToAdd = results2;
          res.send(context);
        });
      }//end of ifelseif
  });//end of INSERT
});

app.post('/removeItemFromMenu', function(req,res){
    var context = {};
    var postData = req.body;
    mysql.pool.query("DELETE FROM menu_items WHERE (`mid` = ?) and (`iid` = ?);", [postData.menu_id,postData.item_id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results;
    res.send(context);
  });
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
