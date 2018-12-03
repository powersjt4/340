module.exports = (function () {
  var express = require('express')
  var router = express.Router()

  router.get('/', function (req, res) {
    var context = {}
    var mysql = req.app.get('mysql')
    mysql.pool.query('SELECT * FROM primary_ingredient ORDER BY id ASC', function (err, piResults, fields) {
      if (err) {
        next(err)
        return
      }
      context.piResults = piResults
      res.render('addpi', context)
    })
  })

  /* Adds a primary ingredient, redirects to the add primary ingredient page after adding */

  router.post('/', function (req, res) {
    var mysql = req.app.get('mysql')
    var sql = 'INSERT INTO primary_ingredient (name) VALUES (?)'
    var inserts = [req.body.name]
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(JSON.stringify(error))
        res.write(JSON.stringify(error))
        res.end()
      } else {
        res.redirect('/addpi')
      }
    })
  })

  /* Route to delete a primary ingredient, simply returns a 202 upon success. Ajax will handle this. */

  router.delete('/:id', function (req, res) {
    var mysql = req.app.get('mysql')
    var sql = 'DELETE FROM primary_ingredient WHERE id = ?'
    var inserts = [req.params.id]
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log('Error in delete primary ingredient')
        console.log(JSON.stringify(error))
        res.status(400)
        res.end()
      } else {
        res.status(202).end()
      }
    })
  })

  return router
}())
