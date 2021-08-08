let baseUrl = "";



function getAllKidsByFetch(){
	let thisBody = null;
	fetch(baseUrl + "/kids")
	.then(response => response.json())
	.then(body => gotBody(body));
	
}

function getKidsByDay(){
	let date = document.getElementById('filterDate').value;
	let fullUrl = baseUrl + "/kids/" + date
	fetch(fullUrl)
	.then(response => {
		if (!response.ok){
			loadingError(response);
			throw new Error("Server didn't like request");
		}
		console.log(response);
		return response.json();
		
	})
	.then(body => gotBody(body));
}

function gotBody(body){
	console.log(body);
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

		let editLink = document.createElement("a");
		editLink.classList.add("icon_container");
			editLink.href = baseUrl + "/editKid/" + kid["id"];
				let icon = document.createElement("img")
				icon.className = "icon";
				icon.setAttribute("src", baseUrl + "/static/icon/draw.png");
				editLink.appendChild(icon);
		newKid.appendChild(editLink);

		let addGift = document.createElement("a");
		addGift.classList.add("icon_container");
		addGift.href = baseUrl + "/addGift/" + kid["id"];
				let gift_icon = document.createElement("img")
				gift_icon.className = "icon";
				addGift.style.top = "52px";
				gift_icon.setAttribute("src", baseUrl + "/static/icon/gift.png");
				addGift.appendChild(gift_icon);
		newKid.appendChild(addGift);

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

		let birthday = setRow("Birthday", "h3", kid["birthday"], "p");
		newKid.appendChild(birthday);

		let presents = setRow("Presents", "h3", kid["present"], "p");
		newKid.appendChild(presents);

		let _id = setRow("ID:", "h3", kid["id"], "p");
		newKid.appendChild(_id);

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
	getAllKidsByFetch();
	setView();
	
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
		console.log("Valid Date");
	} else {
		day = new Date();
		console.log("Invalid Date");
		dayOfWeek = day.getDay();
	}
	console.log("DayOfWeek: " + dayOfWeek);
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
	console.log(kid["name"] + ": dayOfWeek: " + dayOfWeek + " Sector: " + sector + " roi: " + roi);

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
