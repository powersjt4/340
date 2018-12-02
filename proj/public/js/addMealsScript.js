/*
* Deletes row from the table
*  after deleting it from the database.
*/
function deleteMeal(id){
	console.log("IN DELETE MEAL" + id);
		var req = new XMLHttpRequest();
		req.open('DELETE','/addmeals/'+id, true);
		req.addEventListener('load',function(){
		if(req.status >= 200 && req.status<400){
			deleteRow("tr"+id);
		}else{
			alert("Error Deleting element "+id +" Try deleting all references");
			}});//end of ael(load)
		req.send();
}
//Shamelessly lifted from https://stackoverflow.com/questions/4967223/delete-a-row-from-a-table-by-id
function deleteRow(rowid)  
{   
    var row = document.getElementById(rowid);
    row.parentNode.removeChild(row);
}
