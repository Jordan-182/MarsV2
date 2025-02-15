// Déclaration clé d'API de la NASA
const APIKEY = "Oieq6TMKCmnwdlgGfUR6gafuMIsl6O4JyeWmkcaM";

// Récupération des boutons
const curiosity = document.querySelector(".curiosity-btn");
const opportunity = document.querySelector(".opportunity-btn");
const spirit = document.querySelector(".spirit-btn");
const pictures = document.querySelector(".pictures");

curiosity.addEventListener("click", (e) => {
  e.preventDefault();
  curiosityCall();
  pictures.innerHTML = "";
  displayPictures();
});

opportunity.addEventListener("click", (e) => {
  e.preventDefault();
  opportunityCall();
  pictures.innerHTML = "";
  displayPictures();
});

spirit.addEventListener("click", (e) => {
  e.preventDefault();
  spiritCall();
  pictures.innerHTML = "";
  displayPictures();
});

function curiosityCall(curiosity) {
  fetch(
    "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=${APIKEY}"
  )
    .then((response) => response.json())
    .then((data) => console.log(data));
}

// VOIR APIKEY INVALIDE
