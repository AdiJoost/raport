let baseUrl = "";

function setupButton(){
	let containerID = document.getElementById('_id');
	containerID.innerText = data["kid_id"]
	let addButton = document.getElementById('btnAddGift');
	addButton.addEventListener("click", function(){
		sendPost();
	}, false);
}

function sendPost(){
	fetch(baseUrl + "/gift/0", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"kid_id": data["kid_id"],
			"gift_type": document.getElementById('giftTypeInput').value,
			"year": document.getElementById('yearInput').value
							})
	})
	.then(response => {
		if (!response.ok){
			getError(response);
			throw new Error("Server didn't like request");
		} else {
			alert(response.status +": Gift added");
			window.location.href = baseUrl + "/home";
		}
	})
	.then (data => console.log(data))
	.catch((error) => console.log(error));
}

function getError(response){
	let body = response.json().then(function(object){
		alert(response.status + ": " + JSON.stringify(object.message));
		console.log(object);
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
	setupButton();
	
}, false)