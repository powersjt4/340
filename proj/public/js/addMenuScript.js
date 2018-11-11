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
					//	element.date = element.date.slice(0, -14);
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
		data.restaurant_name= document.getElementById('rest_frm').value;//Get data from
		if(data.rName == ""){
			alert("Missing restaurant name Field");
			event.preventDefault();
			return;
		}
		data.menu_meal= document.getElementById('menumt_frm').value;//html forms
		req.open('POST','/insertmenu', true);
		console.log("Post Data: " + JSON.stringify(data)); 
		
   		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
				var response = JSON.parse(req.responseText);
				if(response){
					console.log("response " + JSON.stringify(response));
					addToList(response);
				}
			}else{	
				console.log("Error in network request: " + req.statusText); 
		  }});//end of ael(load)
    	req.send(JSON.stringify(data));
		event.preventDefault();
	});

/*
* Add rows and cells to the table that is on the main page. 
* Also implemented as a OL below
*/
function addToList(newMenu){
		console.log("newMenu = " + JSON.stringify(newMenu));
		var row = document.createElement('tr');
		nameCell = document.createElement('td');
		nameCell.innerHTML = newMenu.restaurant_name; 
		row.appendChild(nameCell);
		
		repsCell = document.createElement('td');
		repsCell.innerHTML = newMenu.menu_meal; 
		row.appendChild(repsCell);
		
		delCell = document.createElement('td');
		var delBtn = document.createElement("BUTTON");     
		var delTxt = document.createTextNode("del");       
		delBtn.id =newMenu.id;
		delBtn.appendChild(delTxt); 
		delCell.appendChild(delBtn);
		row.appendChild(delCell);
		
		editCell = document.createElement('td');
		var editBtn = document.createElement("BUTTON");     
		var editTxt = document.createTextNode("Edit");       
		editBtn.id =newMenu.id;
		editBtn.appendChild(editTxt); 
		editCell.appendChild(editBtn);
		row.appendChild(editCell);
		document.getElementById("table").appendChild(row);
		delBtn.addEventListener("click", deleteMenu); 
//		editBtn.addEventListener("click",editItem); 
}


/*
* Deletes row from the table
*  after deleting it from the database.
*/
function deleteMenu(){
	document.getElementById("table").deleteRow(this.parentNode.parentNode.rowIndex);
		var req = new XMLHttpRequest();
		req.open('GET','/deleteMenu/'+this.id, true);
		if(req.status >= 200 && req.status<400){
				document.getElementById("table").deleteRow(this.parentNode.parentNode.rowIndex);
		}

		req.send();
}

