window.addEventListener("load", function(){
	initButtons();
	
	
}, false)

function initButtons(){
	let target = document.getElementById('presentsInput');
	target.appendChild(getBox("Montag"));
	target.appendChild(getBox("Dienstag"));
	target.appendChild(getBox("Mittwoch"));
	target.appendChild(getBox("Donnerstag"));
	target.appendChild(getBox("Freitag"));
}

function getBox(day){
	let container = document.createElement("div");
	container.classList.add("presentsContainer");
		let title = document.createElement("p");
		title.innerText = day;
		container.appendChild(title);

		let morning = document.createElement("input");
		morning.type = "checkbox";
		morning.id = "morning" + day;
		container.appendChild(morning);

		let lunch = document.createElement("input");
		lunch.type = "checkbox";
		lunch.id = "lunch" + day;
		container.appendChild(lunch);

		let afternoon = document.createElement("input");
		afternoon.type = "checkbox";
		afternoon.id = "afternoon" + day;
		container.appendChild(afternoon);
	return container
}