let baseUrl = "";

function getAllGifts(){
	let thisBody = null;
	let url = baseUrl + "/gifts";
	fetch(url)
	.then(response => response.json())
	.then(body => gotBody(body, 'gifts'));
}

function gotBody(body, container_id){
	for (gift in body){
		displayGift(body[gift], container_id);
	}
}

function displayGift(gift, container_id){
	let gifts = document.getElementById(container_id);
	let container = document.createElement("div");
	container.classList.add("gift");
		let kidName = document.createElement("h3");
		kidName.innerText = gift["kid_name"];
		container.appendChild(kidName);

		let birthday = document.createElement("span");
		birthday.innerText = gift["year"] + gift["kid_birthday"].slice(4, 10);
		container.appendChild(birthday);

		container.appendChild(document.createElement("br"));

		let type = document.createElement("span");
		type.innerText = gift["gift_type"] + " to be implemented";
		container.appendChild(type);

		let deleteButton = document.createElement("div");
			deleteButton.classList.add("icon_container");
			deleteButton.style.top = "auto";
			deleteButton.style.bottom= "3px";
			deleteButton.addEventListener("click", function(){
				deleteGift(gift["id"]);
			}, false)
				let icon = document.createElement("img");
				icon.classList.add("icon");
				icon.setAttribute("src", baseUrl + "/static/icon/trash.ico");
				deleteButton.appendChild(icon);
			
			container.appendChild(deleteButton);

	gifts.appendChild(container);
}

function deleteGift(id){
	if (confirm('Möchtest du das Geschenk wirklich aus der Datenbank entfernen? Daten werden entgültig gelöscht')){
		let url = baseUrl + "/gift/" + id;
		fetch (url, {
			method: "DELETE"
			}).then(response => {
		let obj = response.json()
		.then(function(object){
			alert(response.status +": " + object.message);
			clearGifts("gifts");
			getAllGifts();
			})
	})
	}
}

function clearGifts(container_id){
	let gifts = document.getElementById(container_id);
	gifts.innerText = "";
}

function filterGifts(){
	let startDate = document.getElementById('giftStartDate').value;
	let endDate = document.getElementById('giftEndDate').value;
	clearGifts('gifts_by_date');
	let url = baseUrl + "/gifts";
	fetch(url,{
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"start_date": startDate,
			"end_date": endDate,
							})
	})
	.then(response => response.json())
	.then(body => gotBody(body, 'gifts_by_date'));
	getKids(startDate, endDate);
}

function getKids(startDate, endDate){
	let url = baseUrl + "/kids";
	fetch(url, {
		method: "POST",
		headers: {
		"Content-Type": "application/json"
		},
		body: JSON.stringify({"start_date": parseInt(startDate.slice(5,)),
								"end_date": parseInt(endDate.slice(5,))
							})
	})
	.then(response => response.json())
	.then(body => gotKidBody(body));
}

function gotKidBody(body){
	clearGifts("kidsGift");
	for (kid in body){
		displayKid(body[kid], "kidsGift")
	}
}

function displayKid(kid, container_id){
	let kids = document.getElementById(container_id);

		let container = document.createElement("div");
		container.classList.add("kid_box");

			let name = document.createElement("h3");
			name.innerText = kid["name"];
			container.appendChild(name);

			let birthday = document.createElement("span");
			birthday.innerText = "Monat: " + kid["birthday"].slice(5,7) + "\n Tag: " + kid["birthday"].slice(8,);
			container.appendChild(birthday);

		kids.appendChild(container);

}


function setupButtons(){
	let filterButton = document.getElementById('btnFilterGift');
	filterButton.addEventListener('click', function(){
		filterGifts();
	}, false)
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
	setupButtons();
	filterGifts();
	getAllGifts();
	
}, false)