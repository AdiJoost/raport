let url = "http://192.168.1.120:5000";



function getAllTasks(){
	let thisBody = null;
	fetch("http://192.168.1.120:5000/tasks/all")
	.then(response => response.json())
	.then(body => gotBody(body));
	
}

function gotBody(body){
	console.log(body);
	for (task in body){
		displayTask(body[task]);
	}
}

function displayTask(task){
	console.log(task);
	let tasks = document.getElementById("tasks");
		let container = document.createElement("div");
		container.classList.add("task");
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
		tasks.appendChild(container);

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
		console.log(response);
		return response.json();
		
	})
	.then(body => gotBody(body));
}






window.addEventListener("load", function(){
	getAllTasks();
	
}, false)





