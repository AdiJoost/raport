"use strict";
let baseUrl = "";

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
	document.getElementById('birthdayInput').value = body["birthday"];
	document.getElementById('eatingInput').value = body["eating"];
	document.getElementById('sleepingInput').value = body["sleeping"];
	document.getElementById('spezInput').value = body["spez"];
	document.getElementById('importantInput').value = body["important"];
	document.getElementById('_id').innerText = body["id"];
	setPresents(body["present"]);
}

function setPresents (code){
	setDay("Montag", code.slice(0,1));
	setDay("Dienstag", code.slice(1,2));
	setDay("Mittwoch", code.slice(2,3));
	setDay("Donnerstag", code.slice(3,4));
	setDay("Freitag", code.slice(4,5));
}

function setDay(day, letter){
	let morning = document.getElementById('morning' + day);
	let lunch = document.getElementById('lunch' + day);
	let afternoon = document.getElementById('afternoon' + day);
	switch (letter){
		case "a":
			morning.checked = true;
			lunch.checked = true;
			afternoon.checked = true;
			break;
		case "b":
			morning.checked = true;
			lunch.checked = true;
			break;
		case "c":
			morning.checked = true;
			break;
		case "d":
			lunch.checked = true;
			afternoon.checked = true;
			break;
		case "e":
			afternoon.checked = true;
			break;
	}
}

function setupButton(){
	let myButton = document.getElementById('btnAddKid')
	myButton.addEventListener("click", function(){
		let body = getBody();
		sendPost(body);
	}, false);

	let btnDelete = document.getElementById('deleteKid');
	btnDelete.addEventListener("click", function(){
		if (confirm('Möchtest du das Kind wirklich aus der Datenbank entfernen? Daten werden entgültig gelöscht')){
			deleteKid();
		}
		
	}, false);
}

function deleteKid(){
	let url = baseUrl + "/kid/" + data["id"];
	fetch (url, {
		method: "DELETE"
	}).then(response => {
		let obj = response.json()
		.then(function(object){
			alert(response.status +": " + object.message);
			window.location.href = baseUrl + "/home";
			})
	})
}

//returns Body from Form to send in POST method || Body is Json
function getBody(){

	let myBody = {"name" : getValueByID("nameInput"),
				"parents": getValueByID("parentsInput"),
				"present": getPresents(),
				"birthday": getValueByID("birthdayInput"),
				"eating": getValueByID("eatingInput"),
				"sleeping": getValueByID("sleepingInput"),
				"spez": getValueByID("spezInput"),
				"important": getValueByID("importantInput"),
				"id": data["id"]}
	return JSON.stringify(myBody);
}

function getPresents(){
	let returnCode = "";
	returnCode += getDayCode("Montag");
	returnCode += getDayCode("Dienstag");
	returnCode += getDayCode("Mittwoch");
	returnCode += getDayCode("Donnerstag");
	returnCode += getDayCode("Freitag");
	return returnCode;
}

function getDayCode(day){
	let morning = document.getElementById('morning' + day);
	let lunch = document.getElementById('lunch' + day);
	let afternoon = document.getElementById('afternoon' + day);

	if (morning.checked && lunch.checked && afternoon.checked){
		return "a";
	} else if (morning.checked && lunch.checked && !afternoon.checked){
		return "b";
	} else if (morning.checked && !lunch.checked && !afternoon.checked){
		return "c";
	} else if (!morning.checked && lunch.checked && afternoon.checked){
		return "d";
	} else if (!morning.checked && !lunch.checked && afternoon.checked){
		return "e";
	} 
	return "f";
}

function sendPost(payload){
	fetch(baseUrl + "/kid/none", {
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

function navSetup(){
	let nav = document.getElementById('topNav');
		nav.appendChild(createNav("Geschenke", "/giftpage"))
		nav.appendChild(createNav("Task hinzufügen", "/addTask"))
		nav.appendChild(createNav("Tasks", "/tasks"))
		nav.appendChild(createNav("Verwalten", "/allKids"))
		nav.appendChild(createNav("Kind hinzufuegen", "/addKid"))
		nav.appendChild(createNav("Startseite", "/home"))

}

function createNav(name, myUrlTail){
	let aTag = document.createElement("a");
	aTag.href = baseUrl + myUrlTail;
		let spanTag = document.createElement("span");
		spanTag.classList.add("addKid");
		spanTag.innerText = name;
		aTag.appendChild(spanTag);
	return aTag;
}

window.addEventListener("load", function(){
	baseUrl = window.location.origin;
	navSetup();
	setupView();
	setupButton();
}, false)