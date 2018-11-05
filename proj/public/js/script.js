/*
* On page load the code below calls
* the server to get all the values in the
* MYSQL database
*/

document.addEventListener('DOMContentLoaded', getMenuDB);
function getMenuDB(){
		var req = new XMLHttpRequest();
		req.open('GET','/getMenuDB', true);
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
				var response = JSON.parse(req.responseText);
				response.forEach(function(element, index, response){
						element.date = element.date.slice(0, -14);
						addToList(element);
				});//eoforeach
			}else{	
				console.log("Error in network request: " + request.statusText); 
		  }});//end of ael(load)
		req.send();
}

/*
* Insert: This will insert a value into the database 
* and then add that data to the list item on the homepage
*/
	document.getElementById('submitMenu').addEventListener('click',function(event){
		var req = new XMLHttpRequest();
		var data = {rName: null, mealType: null};
		data.name = document.getElementById('rest_frm').value;//Get data from
		if(data.name == ""){
			alert("Missing Name Field");
			event.preventDefault();
			return;
		}
		data.menumt = document.getElementById('menumt_frm').value;//html forms
			req.open('POST','/insertmenu', true);
		
		
   		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
				var response = JSON.parse(req.responseText);
				if(response)
					addToList(response);
			}else{	
				console.log("Error in network request: " + req.statusText); 
		  }});//end of ael(load)
    	req.send(JSON.stringify(data));
		event.preventDefault();
	});

/*
* Insert: This will insert a value into the database 
* and then add that data to the list item on the homepage
*/
	document.getElementById('submitItem').addEventListener('click',function(event){

		var req = new XMLHttpRequest();
		var data = {name: null, reps: null, weight:null, date:null, lbs:null};
		data.name = document.getElementById('name_frm').value;//Get data from
		if(data.name == ""){
			alert("Missing Name Field");
			event.preventDefault();
			return;
		}
		data.reps = document.getElementById('reps_frm').value;//html forms
		data.weight= document.getElementById('weight_frm').value;
		data.date = document.getElementById('date_frm').value;
		if (document.getElementById('weightType1').checked) 
  			data.lbs = document.getElementById('weightType1').value;
		else	
		  	data.lbs = document.getElementById('weightType2').value;

			req.open('POST','/insert', true);
		
		
   		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
				var response = JSON.parse(req.responseText);
				if(response)
					addToList(response);
			}else{	
				console.log("Error in network request: " + req.statusText); 
		  }});//end of ael(load)
    	req.send(JSON.stringify(data));
		event.preventDefault();
	});

