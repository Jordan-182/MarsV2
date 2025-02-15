// Déclaration clé d'API de la NASA
let API_KEY = "";

fetch("./config.json")
  .then((response) => response.json())
  .then((config) => {
    API_KEY = config.API_KEY;
  })
  .catch((error) =>
    console.error("Erreur lors du chargement de la clé API:", error)
  );

// Récupération des boutons
const curiosity = document.querySelector(".curiosity-btn");
const pictures = document.querySelector(".pictures");

curiosity.addEventListener("click", (e) => {
  e.preventDefault();
  curiosityCall();
});

function curiosityCall() {
  pictures.innerHTML = "<p>Chargement des photos...</p>";

  fetch(
    `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const lastSol = data.photo_manifest.photos.pop().sol; // Dernier sol avec des photos
      console.log("Dernier sol avec des photos :", lastSol);

      return fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${lastSol}&per_page=25&api_key=${API_KEY}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      pictures.innerHTML = "";

      if (data.photos.length === 0) {
        pictures.innerHTML = "<p>Pas de photo disponible.</p>";
      } else {
        displayPictures(data.photos);
      }
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des photos :", error);
      pictures.innerHTML = "<p>Erreur lors du chargement des photos.</p>";
    });
}

function displayPictures(photos) {
  pictures.innerHTML = ""; // Vider l'affichage précédent

  photos.forEach((photo) => {
    const img = document.createElement("img");
    img.src = photo.img_src;
    img.alt = `Photo prise par ${photo.rover.name} le ${photo.earth_date}`;
    img.classList.add("mars-photo");

    pictures.appendChild(img);
  });
}
