let baseUrl = "http://192.168.1.120:5000";

function getAllGifts(){
	let thisBody = null;
	let url = baseUrl + "/gifts";
	fetch(url)
	.then(response => response.json())
	.then(body => gotBody(body));
}

function gotBody(body){
	for (gift in body){
		console.log(body[gift]);
		displayGift(body[gift]);
	}
}

function displayGift(gift){
	let gifts = document.getElementById('gifts');
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
			getAllGifts();
			})
	})
	}
}

function clearGifts(){
	let gifts = document.getElementById('gifts');
	gifts.innerText = "";
}

window.addEventListener("load", function(){
	getAllGifts();
	
}, false)