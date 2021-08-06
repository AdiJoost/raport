let baseUrl = "http://192.168.1.120:5000";
let posibleStati = 4;


function getAllTasks(){
	let thisBody = null;
	let url = baseUrl + "/tasks/all";
	fetch(url)
	.then(response => response.json())
	.then(body => gotBody(body));
	
}

function getTasks(){
	let gotOne = false;
	if (document.getElementById('cb_todo').checked){
		getTasksByStatus(1);
		gotOne = true;
	}
	if (document.getElementById('cb_worked_on').checked){
		getTasksByStatus(2);
		gotOne = true;
	}
	if (document.getElementById('cb_done').checked){
		getTasksByStatus(3);
		gotOne = true;
	}
	if (document.getElementById('cb_error').checked){
		getTasksByStatus(4);
		gotOne = true;
	}
	if (!gotOne){
		getAllTasks();
	}
}


function getTasksByStatus(status){
	let url = baseUrl + "/tasks/status";
	fetch(url, {
		method: "POST",
		headers: {
		"Content-Type": "application/json"
		},
		body: JSON.stringify({"status": status})
	})
	.then(response => response.json())
	.then(body => gotBody(body));
	
}

function gotBody(body){
	for (task in body){
		displayTask(body[task]);
	}
}

function displayTask(task){
	let tasks = document.getElementById("tasks" + task["status"]);
		let container = document.createElement("div");
		container.classList.add(getClass(task["status"]));
		container.classList.add("task");

			let deleteButton = document.createElement("div");
			deleteButton.classList.add("icon_container");
				let icon = document.createElement("img");
				icon.classList.add("icon");
				icon.setAttribute("src", baseUrl + "/static/icon/trash.ico");
				deleteButton.appendChild(icon);
			deleteButton.style.top = "auto";
			deleteButton.style.bottom= "3px";
			container.appendChild(deleteButton);

			let done = document.createElement("div");
			done.classList.add("btnDone");
			done.classList.add("btnTask");
			done.addEventListener("click", function(){
				taskUpdate(task, 3);
			}, false);
			container.appendChild(done);

			let open = document.createElement("div");
			open.classList.add("btnOpen");
			open.classList.add("btnTask");
			open.addEventListener("click", function(){
				taskUpdate(task, 1);
			}, false);
			container.appendChild(open);

			let worked_on = document.createElement("div");
			worked_on.classList.add("btnWorked_on");
			worked_on.classList.add("btnTask");
			worked_on.addEventListener("click", function(){
				taskUpdate(task, 2);
			}, false);
			container.appendChild(worked_on);

			let errorTask = document.createElement("div");
			errorTask.classList.add("btnErrorTask");
			errorTask.classList.add("btnTask");
			errorTask.addEventListener("click", function(){
				taskUpdate(task, 4);
			}, false);
			container.appendChild(errorTask);

			let name = document.createElement("h2");
			name.innerText = task["name"];
			container.appendChild(name);

			let due = document.createElement("p");
			due.innerHTML = "<b>Due: </b>" + task["due"];
			container.appendChild(due);

			let description = document.createElement("p");
			description.classList.add("description");
			description.innerText = task["description"];
			container.appendChild(description);

			let deleteIcon = document.createElement("span");
			
		tasks.appendChild(container);

}

function taskUpdate(task, status){
	url = baseUrl + "/task/" + task["id"];
	fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"status": status})
	})
	.then(response => {
		clearTasks();
		getTasks();
	});
}

function getClass(status){
	switch(status){
		case 1:
			return "toDo";
		case 2:
			return "worked_on";
		case 3:
			return "done";
		case 4:
			return "error";
		default:
			return "_default"
	}
}

function getKidsByDay(){
	let date = document.getElementById('filterDate').value;
	let fullUrl = url + "/kids/" + date
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

function clearTasks(){
	for (let i = 1; i <= posibleStati; i++){
		let tasks = document.getElementById('tasks' + i);
		tasks.innerText = "";
	}
	
}

function setupButtons(){
	let filterButton = document.getElementById('btnApplyFilter');
	filterButton.addEventListener("click", function(){
		clearTasks();
		getTasks();
	}, false);
}





window.addEventListener("load", function(){
	getAllTasks();
	setupButtons();
	
}, false)





