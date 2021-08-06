let baseUrl = "http://192.168.1.120:5000";

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

window.addEventListener("load", function(){
	setupButton();
	
}, false)