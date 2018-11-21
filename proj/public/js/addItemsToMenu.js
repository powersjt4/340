document.getElementById('restaurantMenuSelect').addEventListener('click',function(event){
		var req = new XMLHttpRequest();
		var data = {};
		console.log("restaurantSelect = " +document.getElementById('menuSelectDropdown').value);
		data.id = document.getElementById('menuSelectDropdown').value;
 		console.log("data.id = " +data.id); 

		req.open('GET','/getMenuItems/'+data.id, true);
		req.addEventListener('load',function(){
			if(req.status >= 200 && req.status<400){
					var response = JSON.parse(req.responseText);
				if(response){
					console.log("Response " + JSON.stringify(response));
					//addToList(response);
				}
			} else{
				console.log("Error sending menu id")
			}
		});//end of ael(load)
		req.send();
});