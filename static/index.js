let baseUrl = "http://192.168.1.120:5000";


function getAllKidsByFetch(){
	let thisBody = null;
	fetch("http://192.168.1.120:5000/kids")
	.then(response => response.json())
	.then(body => gotBody(body));
	
}

function getKidsByDay(){
	let date = document.getElementById('filterDate').value;
	if (date == ""){
		date = new Date().toJSON().slice(0,10);
	}
	let fullUrl = baseUrl + "/kids/" + date
	fetch(fullUrl)
	.then(response => {
		if (!response.ok){
			loadingError(response);
			throw new Error("Server didn't like request");
		}
		return response.json();
		
	})
	.then(body => gotBody(body));
}

function gotBody(body){
	clearKidsInfo();
	for (kid in body){
		setElement(body[kid]);
	}
}

function loadingError(response){
	let body = response.json().then(function(object){
		clearKidsInfo();
		let message = document.createElement("h2")
		message.innerText = response.status + ": " + object.message;

		let errorMessage = document.createElement("div")
		errorMessage.className = "kid_box"
		errorMessage.appendChild(message);

		let container = document.getElementById('kinderinfo');
		container.appendChild(errorMessage);
	});
	
}


function clearKidsInfo(){
	let kidsInfo = document.getElementById('kinderinfo');
	kidsInfo.innerText = "";
}

function setElement(kid){
	let newKid = setKid(kid);
	newKid.className = "kid_box";
	
    let container = document.getElementById('kinderinfo');
    container.appendChild(newKid);

}

function setKid(kid){
	let newKid = document.createElement("div");

	

		let titleNav = document.createElement("div");
		titleNav.classList.add("kidTitleNav");
			let name = document.createElement("h2");
			name.innerText = kid["name"];
			name.style.display = "inline";
			titleNav.appendChild(name);


		newKid.appendChild(titleNav);



		let presentsDisplay = document.createElement("div");
			let presentTitle = document.createElement("h3");
			presentTitle.innerText = "Anwesenheit";
			presentsDisplay.appendChild(presentTitle);

			let morningBox = getPresentsBox(kid, 0);
			presentsDisplay.appendChild(morningBox);

			let lunchBox = getPresentsBox(kid, 1);
			presentsDisplay.appendChild(lunchBox);

			let afternoonBox = getPresentsBox(kid, 2);
			presentsDisplay.appendChild(afternoonBox, 2);

		newKid.appendChild(presentsDisplay)

		let eating = setRow("Essen", "h3", kid["eating"], "p");
		newKid.appendChild(eating);

		let sleeping = setRow("Schlafen", "h3", kid["sleeping"], "p");
		newKid.appendChild(sleeping);

		let parents = setRow("Eltern", "h3", kid["parents"], "p");
		newKid.appendChild(parents);

		let important = setRow("Wichtig", "h3", kid["important"], "p");
		newKid.appendChild(important);

		let spez = setRow("Speziell:", "h3", kid["spez"], "p");
		newKid.appendChild(spez);

	return newKid;
}

function setRow(title, title_type, text, text_type){
	let title_row = document.createElement(title_type);
	title_row.innerText = title;
	let text_row = document.createElement(text_type);
	text_row.innerText = text;
	let return_paragraph = document.createElement("p");
	return_paragraph.appendChild(title_row);
	return_paragraph.appendChild(text_row);
	return return_paragraph;
}

function setView(){
	let filterButton = document.getElementById('btnFilterDate');
	filterButton.addEventListener("click", function(){
		getKidsByDay();
	}, false);
}

function getBirthdays(){
	let url = baseUrl + "/kids";
	start_date = parseInt(new Date().toJSON().slice(5,7)) - 1;
	end_date = start_date + 2;
	if (end_date > 12){
		end_date -= 12;
	}
	fetch(url, {
		method: "POST",
		headers: {
		"Content-Type": "application/json"
		},
		body: JSON.stringify({"start_date": start_date,
								"end_date": end_date
							})
	})
	.then(response => response.json())
	.then(body => gotKidBody(body));
}

function gotKidBody(body){
	clearGifts("birthdays");
	for (kid in body){
		displayKid(body[kid], "birthdays")
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

function clearGifts(container_id){
	let gifts = document.getElementById(container_id);
	gifts.innerText = "";
}

function filterGifts(){
	let thisMonth = new Date().getMonth() + 1;
	let thisYear = new Date().getFullYear();
	let startMonth = thisMonth;
	let endMonth = thisMonth;
	let endYear = thisYear;
	let startYear = thisYear;
	if (thisMonth != 1){
		startMonth = thisMonth - 1;
		endMonth = thisMonth + 1;
		if (endMonth > 12){
			endMonth -= 12;
			endYear += 1;
		}
	} else {
		startMonth = 12;
		startYear -= 1;
		endMonth = thisMonth + 1;
	}
	clearGifts('gifts');
	console.log(new Date(startYear, startMonth, 1,0,0,0).toJSON().slice(0,10));
	console.log(new Date(endYear, endMonth, 1,0,0,0).toJSON().slice(0,10));
	let url = baseUrl + "/gifts";
	fetch(url,{
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"start_date": new Date(startYear, startMonth, 1,0,0,0).toJSON().slice(0,10),
			"end_date": new Date(endYear, endMonth, 1,0,0,0).toJSON().slice(0,10),
							})
	})
	.then(response => response.json())
	.then(body => gotGiftBody(body, 'gifts'));
}

function gotGiftBody(body, container_id){
	clearGifts(container_id);
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

window.addEventListener("load", function(){
	setView();
	getKidsByDay();
	getBirthdays();
	filterGifts();
	/*let kids_raw = getAllKids();
	kids = JSON.parse(kids_raw);
	for (kid in kids){
		setElement(kids[kid]);
	}*/
	
	
}, false)



/*
Returns Box indicating if Kid is pressent in that sector.
0 = morning, 1=lunch, 2=afternoon
*/
function getPresentsBox(kid, sector){
	let box = document.createElement("div");
	
	box.classList.add("presentBox");
	if (isPresent(kid, sector)){
		box.classList.add("isHere");
	}
	return box;
}

function isPresent(kid, sector){
	let day = new Date(document.getElementById('filterDate').value);
	let dayOfWeek = 0;
	if (!isNaN(day.getTime())){
		dayOfWeek = day.getDay();
	} else {
		day = new Date();
		dayOfWeek = day.getDay();
	}
	//wenn zuviel Zeit: Durch switch-Statement ersetzen
	let roi = "f";
	if(dayOfWeek == 1){
		roi = kid["present"].slice(0, 1);
	} else if (dayOfWeek == 2){
		roi = kid["present"].slice(1, 2);
	} else if (dayOfWeek == 3){
		roi = kid["present"].slice(2, 3);
	} else if (dayOfWeek == 4){
		roi = kid["present"].slice(3, 4);
	} else if (dayOfWeek == 5){
		roi = kid["present"].slice(4, 5);
	}

	switch(sector){
		case 0:
			if (roi == "a" || roi == "b" || roi == "c"){
				return true;
			}
			break;
		
		case 1:
			if (roi == "a" || roi =="b" || roi =="d"){
				return true;
			}
			break;
		case 2:
			if (roi == "a" || roi == "d" || roi == "e"){
				return true;
			}
			break;
	}

	return false;

}
