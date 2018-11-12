/*
* On page load the code below calls
* the server to get all the values in the
* MYSQL database
*/

document.addEventListener('DOMContentLoaded', getDatabase);
function getDatabase(){
		var req = new XMLHttpRequest();
		req.open('GET','/getDatabase', true);
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
	document.getElementById('submitWorkout').addEventListener('click',function(event){

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
/*
* Add rows and cells to the table that is on the main page. 
* Also implemented as a OL below
*/
function addToList(newWorkout){
		if(newWorkout.lbs == 1)
			newWorkout.lbs ="lbs";
		else
			newWorkout.lbs = "kgs"
		var row = document.createElement('tr');
		nameCell = document.createElement('td');
		nameCell.innerHTML = newWorkout.name; 
		row.appendChild(nameCell);
		
		repsCell = document.createElement('td');
		repsCell.innerHTML = newWorkout.reps; 
		row.appendChild(repsCell);
		
		weightCell = document.createElement('td');
		weightCell.innerHTML = newWorkout.weight; 
		row.appendChild(weightCell);
		
		dateCell = document.createElement('td');
		dateCell.innerHTML = newWorkout.date; 
		row.appendChild(dateCell);
		
		lbsCell = document.createElement('td');
		lbsCell.innerHTML = newWorkout.lbs; 
		row.appendChild(lbsCell);
		
		delCell = document.createElement('td');
		var delBtn = document.createElement("BUTTON");     
		var delTxt = document.createTextNode("del");       
		delBtn.id =newWorkout.id;
		delBtn.appendChild(delTxt); 
		delCell.appendChild(delBtn);
		row.appendChild(delCell);
		
		editCell = document.createElement('td');
		var editBtn = document.createElement("BUTTON");     
		var editTxt = document.createTextNode("Edit");       
		editBtn.id =newWorkout.id;
		editBtn.appendChild(editTxt); 
		editCell.appendChild(editBtn);
		row.appendChild(editCell);
		document.getElementById("table").appendChild(row);
		delBtn.addEventListener("click", deleteItem); 
		editBtn.addEventListener("click",editItem); 

/*		var workString = newWorkout.name+" "+ newWorkout.reps+" "+newWorkout.weight+" "+newWorkout.date+" "+newWorkout.lbs;
		var listItem  = document.createElement("LI"); 
		listItem.id = "workout"+newWorkout.id; 
		var workout  = document.createTextNode(workString); 
		listItem.appendChild(workout); 
		var delBtn = document.createElement("BUTTON");     
		var delTxt = document.createTextNode("Delete");       
		delBtn.id =newWorkout.id;
		delBtn.appendChild(delTxt); 
		listItem.appendChild(delBtn);
		var editBtn = document.createElement("BUTTON");     
		var editTxt = document.createTextNode("Edit");       
		editBtn.id =newWorkout.id;
		editBtn.appendChild(editTxt); 
		listItem.appendChild(editBtn);

		document.getElementById("newItems").appendChild(listItem); 
		delBtn.addEventListener("click", deleteItem); 
		editBtn.addEventListener("click",editItem); 
*/
}
/*
* Deletes row from the table
*  after deleting it from the database.
*/
function deleteItem(){
	document.getElementById("table").deleteRow(this.parentNode.parentNode.rowIndex);
		var req = new XMLHttpRequest();
		req.open('GET','/delete/'+this.id, true);
		if(req.status >= 200 && req.status<400){
				document.getElementById("table").deleteRow(this.parentNode.parentNode.rowIndex);
		}

		req.send();
}
/*
* Probably not the cleanest implement of the update
* but it works refreshes the page after recieving response.
*/
function editItem(){
		var id = this.id;
		var req = new XMLHttpRequest();
		req.open('GET','/select?id='+this.id, true);
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
				var response = JSON.parse(req.responseText);	
				response[0].date = response[0].date.slice(0, -14);
				document.getElementById("name_frm").value = response[0].name;
				document.getElementById("reps_frm").value = response[0].reps;
				document.getElementById("weight_frm").value = response[0].weight;
				document.getElementById("date_frm").value = response[0].date;
				if(response[0].lbs == 1)
					document.getElementById("weightType1").checked = true;
				else
					document.getElementById("weightType2").checked = true;
					document.getElementById("submitWorkout").style.display="none";
					document.getElementById("editWorkout").style.display = "block";	
					document.getElementById('editWorkout').addEventListener('click',function(event){
						var req = new XMLHttpRequest();
						var data = {id: null, name: null, reps: null, weight:null, date:null, lbs:null};
						data.name= document.getElementById('name_frm').value;
						data.reps = document.getElementById('reps_frm').value;
						data.weight= document.getElementById('weight_frm').value;
						data.date = document.getElementById('date_frm').value;
						if (document.getElementById('weightType1').checked) 
						data.lbs = document.getElementById('weightType1').value;
							else	
						data.lbs = document.getElementById('weightType2').value;
						data.id = id;
							if(data != "")
							req.open('POST','/update', true);
   						req.setRequestHeader('Content-Type', 'application/json');
						req.addEventListener('load',function(){
						if(req.status >= 200 && req.status<400){
							location.reload();
						}else{	
							console.log("Error in network request: " + req.statusText); 
		  				}});//end of ael(load)
    					req.send(JSON.stringify(data));
						event.preventDefault();
				});				
		}else{	
			console.log("Error in network request: " + request.statusText); 
		}});//end of ael(load)
		req.send();

}
