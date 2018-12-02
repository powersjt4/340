/*
* On page load the code below calls
* the server to get all the values in the
* MYSQL database
*/
document.addEventListener('DOMContentLoaded', getItemDB);
function getItemDB(){
		var req = new XMLHttpRequest();
		req.open('GET','/getItemDB', true);
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
				var response = JSON.parse(req.responseText);
				response.forEach(function(element, index, response){
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
	document.getElementById('submitItem').addEventListener('click',function(event){
		var req = new XMLHttpRequest();
		var data = {name: null, price: null, description: null, item_meal: null, primary_ingredient:null};
		data.name = document.getElementById('name_frm').value;
		if(data.name == ""){
			alert("Missing Name Field");
			event.preventDefault();
			return;
		}
		data.price = document.getElementById('price_frm').value;
		data.description = document.getElementById('desc_frm').value;
		data.item_meal= document.getElementById('item_meal_frm').value;
		data.primary_ingredient = document.getElementById('pi_frm').value;
		req.open('POST','/insertItem', true);
   		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
				var response = JSON.parse(req.responseText);
				if(response){
					addToList(response.selectResults[0]);
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
function addToList(newItem){
		console.log("newItem = " + JSON.stringify(newItem));
		var row = document.createElement('tr');
		nameCell = document.createElement('td');
		nameCell.innerHTML = newItem.name; 
		row.appendChild(nameCell);
		
		priceCell = document.createElement('td');
		priceCell.innerHTML = newItem.price; 
		row.appendChild(priceCell);
	
		descCell = document.createElement('td');
		descCell.innerHTML = newItem.description; 
		row.appendChild(descCell);
		
		mtCell = document.createElement('td');
		mtCell.innerHTML = newItem.item_meal; 
		row.appendChild(mtCell);
	
		piCell = document.createElement('td');
		piCell.innerHTML = newItem.primary_ingredient; 
		row.appendChild(piCell);

		delCell = document.createElement('td');
		var delBtn = document.createElement("BUTTON");     
		var delTxt = document.createTextNode("del");       
		delBtn.id =newItem.id;
		delBtn.appendChild(delTxt); 
		delCell.appendChild(delBtn);
		row.appendChild(delCell);
		
		document.getElementById("table").appendChild(row);
		delBtn.addEventListener("click", deleteItem); 
}

/*
* Deletes row from the table
*  after deleting it from the database.
*/
function deleteItem(){
	document.getElementById("table").deleteRow(this.parentNode.parentNode.rowIndex);
		var req = new XMLHttpRequest();
		req.open('GET','/deleteItem/'+this.id, true);
		if(req.status >= 200 && req.status<400){
				document.getElementById("table").deleteRow(this.parentNode.parentNode.rowIndex);
		}

		req.send();
}

