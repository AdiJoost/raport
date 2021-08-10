let baseUrl = "";

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
}, false)