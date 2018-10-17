var express = require('express');

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

app.get('/about',function(req,res){
  res.render('about');
});

app.get('/location',function(req,res){
  res.render('location');
});

app.get('/',function(req,res){
	res.render('home');
});

/*Menu */
menuData = require('./menu.json'); 

app.get('/menus/:index',function(req,res,next){
  var index = req.params.index; 

  var menuList = menuData[index];   
  if(menuList){
    var context={
       object: menuList
           }
   res.render(index, context);        
  }else{
    console.log("Error reading JSON file.");
  }
});

/*Download menus*/
app.get('/download/:index', function (req, res) {
    var index = req.params.index; 
     var filePath = "./views/menus/download/"+index;
     res.download(filePath);
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
