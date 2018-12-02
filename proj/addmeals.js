module.exports = function(){
    var express = require('express');
    var router = express.Router();

  router.get('/',function(req,res){
      var context = {};
      var mysql = req.app.get('mysql');
      mysql.pool.query('SELECT * FROM meal ORDER BY id ASC', function(err, mealResults, fields){
        if(err){
          next(err);
          return;
        }
        context.mealResults = mealResults;
        res.render('addmeals',context);
      });
  });

  /* Adds a meal, redirects to the add meal page after adding */

    router.post('/', function(req, res){
        console.log(req.body.name)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO meal (name) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/addmeals');
            }
        });
    });

        /* Route to delete a meal, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM meal WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("Error in delete meal");
                console.log(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                console.log("Success in delete meal");
                res.status(202).end();
            }
        })
    });

    return router;
}();