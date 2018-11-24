var menuSelectedID = null;

document.getElementById('restaurantMenuSelect').addEventListener('click',function(event){
		var req = new XMLHttpRequest();
		var data = {};
		if (document.contains(document.getElementById("itemsOnMenu"))) {
            document.getElementById("itemsOnMenu").remove();
		}
		data.id = document.getElementById('menuSelectDropdown').value;
		menuSelectedID = data.id;
		req.open('GET','/getMenuItems/'+data.id, true);
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
					var response = JSON.parse(req.responseText);
				if(response){
					createTable("itemsOnMenu", "itemsHeader")
					response.menuItems.forEach(function(element, index, response){
						addToTable(element,"itemsOnMenu");
					});//eoforeach
					response.allItems.forEach(function(element, index, response){
						addToTable(element,"allItems");
					});//eoforeach 
				}
			} else{
				console.log("Error sending menu id")
			}
		});//end of ael(load)
		req.send();
		event.preventDefault();
});



function createTable(tableName, appendWhere){
	var table = document.createElement('table');
	table.setAttribute("id", tableName);
	document.getElementById(appendWhere).appendChild(table);
}

/*
* Deletes row from the table
*  after deleting it from the database.
*/
function addItem(){
		var req = new XMLHttpRequest();
		var data = {menu_id: null,item_id: null};
		data.menu_id = menuSelectedID;
		data.item_id = this.id;
		req.open('POST','/addToMenu', true);
   		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
				var response = JSON.parse(req.responseText);
				if(response){
					if(response.affectedRows == 0){
						console.log("Response.affectedRows = " + JSON.stringify(response.insert));
						alert("Item already in current menu.");		
					}else{
						addToTable(response.itemToAdd[0],"itemsOnMenu");
					}
				}
			}else{	
				console.log("Error in network request: " + req.statusText); 
		  }});//end of ael(load)
    	req.send(JSON.stringify(data));
		event.preventDefault();
}

function removeItemFromMenu(){
		document.getElementById("itemsOnMenu").deleteRow(this.parentNode.parentNode.rowIndex);
		var req = new XMLHttpRequest();
		var data = {menu_id: null,item_id: null};
		data.menu_id = menuSelectedID;
		data.item_id = this.id;
		req.open('POST','/removeItemFromMenu', true);
   		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
					document.getElementById("itemsOnMenu").deleteRow(this.parentNode.parentNode.rowIndex);
			}
		});
		req.send(JSON.stringify(data));
}

/*
* Add rows and cells to the table that is on the main page. 
* Also implemented as a OL below
*/
function addToTable(newItem, tableName){
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
		
		if(tableName === "allItems"){
			addCell = document.createElement('td');
			var addBtn = document.createElement("BUTTON");     
			var addTxt = document.createTextNode("Add");       
			addBtn.id =newItem.id;
			addBtn.appendChild(addTxt); 
			addCell.appendChild(addBtn);
			row.appendChild(addCell);
			addBtn.addEventListener("click", addItem); 
		}

		if(tableName === "itemsOnMenu"){
			RemvCell = document.createElement('td');
			var RemvBtn = document.createElement("BUTTON");     
			var RemvTxt = document.createTextNode("Remove");       
			RemvBtn.id =newItem.id;
			RemvBtn.appendChild(RemvTxt); 
			RemvCell.appendChild(RemvBtn);
			row.appendChild(RemvCell);
			RemvBtn.addEventListener("click", removeItemFromMenu); 
		}
		document.getElementById(tableName).appendChild(row);
}