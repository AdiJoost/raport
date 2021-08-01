"use strict";
let baseUrl = "http://192.168.1.120:5000";

function setupView(){
	let id = data["id"];
	let url = baseUrl + "/kid/" + id;
	fetch(url)
	.then(response => response.json())
	.then(body => fillKid(body));
}

function fillKid(body){
	console.log(body);
	let title = document.getElementById('kidName');
	title.innerText = "Kind bearbeiten: " + body["name"];

	document.getElementById('nameInput').value = body["name"];
	document.getElementById('parentsInput').value = body["parents"];
	document.getElementById('presentsInput').value = body["presents"];
	document.getElementById('birthdayInput').value = body["birthday"];
	document.getElementById('eatingInput').value = body["eating"];
	document.getElementById('sleepingInput').value = body["sleeping"];
	document.getElementById('spezInput').value = body["spez"];
	document.getElementById('importantInput').value = body["important"];
	document.getElementById('_id').innerText = body["id"];
}

function setupButton(){
	let myButton = document.getElementById('btnAddKid')
	myButton.addEventListener("click", function(){
		let body = getBody();
		sendPost(body);
	}, false);
}

//returns Body from Form to send in POST method || Body is Json
function getBody(){

	let myBody = {"name" : getValueByID("nameInput"),
				"parents": getValueByID("parentsInput"),
				"present": getValueByID("presentsInput"),
				"birthday": getValueByID("birthdayInput"),
				"eating": getValueByID("eatingInput"),
				"sleeping": getValueByID("sleepingInput"),
				"spez": getValueByID("spezInput"),
				"important": getValueByID("importantInput"),
				"id": data["id"]}
	return JSON.stringify(myBody);
}

function sendPost(payload){
	fetch("http://192.168.1.120:5000/kid/none", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: payload
	})
	.then(response => {
		if (!response.ok){
			getError(response);
			throw new Error("Server didn't like request");
		} else {
			let obj = response.json()
			.then(function(object){
				alert(response.status +": " + object.message);
			})
			
		}
	})
	.then (data => console.log(data))
	.catch((error) => console.log(error));
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
	setupView();
	setupButton();
}, false)