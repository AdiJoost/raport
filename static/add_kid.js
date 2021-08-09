"use strict";

let baseUrl = "";

window.addEventListener("load", function(){
	baseUrl = window.location.origin;
	navSetup();
	setupButton();
}, false)

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
				"present": getPresents(),
				"birthday": getValueByID("birthdayInput"),
				"eating": getValueByID("eatingInput"),
				"sleeping": getValueByID("sleepingInput"),
				"spez": getValueByID("spezInput"),
				"important": getValueByID("importantInput")}
	console.log(myBody);
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
		method: "POST",
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
			alert(response.status +": Kid added");
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


