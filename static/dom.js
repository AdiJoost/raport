function getAllKids(){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://192.168.1.120:5000/kids", false);
        xmlHttp.send()
        return xmlHttp.responseText;

       }

function getAllKidsByFetch(){
	let thisBody = null;
	fetch("http://192.168.1.120:5000/kids")
	.then(response => response.json())
	.then(body => gotBody(body));
	
}

function gotBody(body){
	for (kid in body){
		setElement(body[kid]);
	}
}
/*
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

      

function onAllKidsStateChange (kids_raw){
	kids = JSON.parse(kids_raw);
	console.log(kids);
	for (kid in kids){
		setElement(kids[kid]);
	}
}*/

function setElement(kid){
	let newKid = setKid(kid);
	newKid.className = "kid_box";
	
    let container = document.getElementById('kinderinfo');
    container.appendChild(newKid);

}

function setKid(kid){
	let newKid = document.createElement("div");

	let name = document.createElement("h2");
	name.innerText = kid["name"];
	newKid.appendChild(name);

	let birthday = setRow("Birthday", "h3", kid["birthday"], "p");
	newKid.appendChild(birthday);

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

window.addEventListener("load", function(){
	getAllKidsByFetch();
	/*let kids_raw = getAllKids();
	kids = JSON.parse(kids_raw);
	for (kid in kids){
		setElement(kids[kid]);
	}*/
	
}, false)