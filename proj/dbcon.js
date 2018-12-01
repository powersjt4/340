var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'asdf',
  database        : 'cs340_powersj2'
});

module.exports.pool = pool;
/*
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_powersj2',
  password        : '1283',
  database        : 'cs340_powersj2'
});

module.exports.pool = pool;
*/
