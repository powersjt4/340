document.getElementById('restaurantMenuSelect').addEventListener('click',function(event){
		var req = new XMLHttpRequest();
		var data = {};
		if (document.contains(document.getElementById("displayTable"))) {
            document.getElementById("displayTable").remove();
		}
		console.log("restaurantSelect = " +document.getElementById('menuSelectDropdown').value);
		data.id = document.getElementById('menuSelectDropdown').value;
 		console.log("data.id = " +data.id); 

		req.open('GET','/getMenuItems/'+data.id, true);
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
					var response = JSON.parse(req.responseText);
				if(response){
					console.log("Response " + JSON.stringify(response));
					var table = document.createElement("table");
					table.setAttribute("id", "displayTable");
					document.getElementById("newItems").appendChild(table);
				response.forEach(function(element, index, response){
						addToList(element);
				});//eoforeach
				}
			} else{
				console.log("Error sending menu id")
			}
		});//end of ael(load)
		req.send();
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
		
		editCell = document.createElement('td');
		var editBtn = document.createElement("BUTTON");     
		var editTxt = document.createTextNode("Edit");       
		editBtn.id =newItem.id;
		editBtn.appendChild(editTxt); 
		editCell.appendChild(editBtn);
		row.appendChild(editCell);
		document.getElementById("displayTable").appendChild(row);
//		delBtn.addEventListener("click", deleteItem); 
//		editBtn.addEventListener("click",editItem); 
}