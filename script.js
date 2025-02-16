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

// Gestion du clic sur le bouton
curiosity.addEventListener("click", (e) => {
  e.preventDefault();
  curiosityCall();
});

// Fonction qui est lancée au clic, interroge le manifest pour connaitre le dernier sol ou il y a des photos
// Puis lance la focntion qui va récupérer les photos
function curiosityCall() {
  pictures.innerHTML = `<div id="loading-spinner">
            <div class="loading-spinner__circle loading"></div>
            <p>Chargement des photos...</p>
        </div>`;

  fetch(
    `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const lastSol = data.photo_manifest.photos.pop().sol; // Dernier sol où il y a des photos
      console.log("Dernier sol avec des photos :", lastSol);
      fetchMultipleSols(lastSol, []);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération du sol :", error);
      pictures.innerHTML = "<p>Erreur lors du chargement des photos.</p>";
    });
}

// Fonction qui va récupérer les 25 dernières photos sur l'api en partant du dernier sol pour lequel il y a des photos
// Si on atteint pas 25 photos avec ce sol, elle requeête ensuite le sol précédent jusqu'à obtenir 25 photos
function fetchMultipleSols(sol, collectedPhotos) {
  if (collectedPhotos.length >= 50) {
    pictures.innerHTML = ""; // Efface le message de chargement
    displayPictures(collectedPhotos.slice(0, 25)); // Affiche 25 photos max
    return;
  }

  fetch(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const newPhotos = data.photos;
      console.log(`Sol ${sol} : ${newPhotos.length} photos trouvées`);

      if (newPhotos.length > 0) {
        collectedPhotos = [...collectedPhotos, ...newPhotos]; // Ajouter les nouvelles photos
      }

      if (collectedPhotos.length < 50 && sol > 0) {
        fetchMultipleSols(sol - 1, collectedPhotos); // Rechercher sur le sol précédent
      } else {
        pictures.innerHTML = ""; // Efface le message de chargement
        displayPictures(collectedPhotos.slice(0, 50)); // Affiche les photos disponibles (max 25)
      }
    })
    .catch((error) => {
      console.error(
        `Erreur lors du chargement des photos pour le sol ${sol} :`,
        error
      );
      pictures.innerHTML = "<p>Erreur lors du chargement des photos.</p>";
    });
}

// Fonction qui gère l'affichage des photos récupérées avec une petite description indiquant la date de la photo
function displayPictures(photos) {
  pictures.innerHTML = ""; // Vider l'affichage précédent

  photos.forEach((photo) => {
    const photoBox = document.createElement("div");
    photoBox.classList.add("photo-box");
    const img = document.createElement("img");
    img.src = photo.img_src;
    img.alt = `Photo prise par ${photo.rover.name} le ${photo.earth_date}`;
    img.classList.add("mars-photo");
    const description = document.createElement("p");
    description.classList.add("photo-description");
    description.textContent = `Photo prise par ${photo.rover.name} le ${photo.earth_date}`;
    img.addEventListener("click", () => openFullscreen(photo.img_src));
    pictures.appendChild(photoBox);
    photoBox.appendChild(img);
    photoBox.appendChild(description);
  });
}

// Sélection des éléments pour l'affichage plein écran
const overlay = document.querySelector(".image-overlay");
const fullscreenImg = document.querySelector(".fullscreen-img");
const closeBtn = document.querySelector(".close-btn");

// Fonction pour ouvrir l'image en plein écran
function openFullscreen(imgSrc) {
  fullscreenImg.src = imgSrc; // Met à jour l'image affichée
  overlay.classList.add("active"); // Affiche l'overlay
}

// Fonction pour fermer le plein écran
function closeFullscreen() {
  overlay.classList.remove("active");
}

// Ajouter l'événement de fermeture sur le bouton
closeBtn.addEventListener("click", closeFullscreen);

// Ajouter un événement pour fermer l'overlay en cliquant en dehors de l'image
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeFullscreen();
  }
});
