let baseUrl = "http://192.168.1.120:5000";

function setupButton(){
	let addTask = document.getElementById('btnAddTask');
	addTask.addEventListener("click", function(){
		makePostRequest();
	}, false);
}

function makePostRequest(){
	let url = baseUrl + "/task/none"
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: getBody()
	})
	.then(response => {
		if (!response.ok){
			getError(response);
			throw new Error("Server didn't like request");
		} else {
			alert(response.status +": Task added");
		}
	})
	.then (data => console.log(data))
	.catch((error) => console.log(error));
}

function getBody(){
	let myBody = {
					"name" : getValueByID("taskNameInput"),
					"initialized": getValueByID("initInput"),
					"due": getValueByID("dueInput"),
					"description": getValueByID("descriptionInput")
				}
	return JSON.stringify(myBody);
}

function getValueByID(_id){
	let input = document.getElementById(_id);
	return input.value;
}

function getError(response){
	let body = response.json().then(function(object){
		alert(response.status + ": " + object.message);
	});
	
}


window.addEventListener("load", function(){
	setupButton();
}, false)