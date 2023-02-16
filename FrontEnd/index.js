// import { fetchApiCategories } from "./fetchApiWorks";
// Fetcher api
// Differentes routes:      /works    /categories    /users/login    /works/{id}
const api = "http://localhost:5678/api/";
//Pointer les Filtres
const project = document.getElementById("portfolio");
//Evenement au clik
let categoryIdValue;
//Récupere la data du fetch ApiWorks
let cards = [];

// *****************************************************************************************************
//INJECTION BOUTON EN HTML   (#PORTFOLIO ->) DIV -> BUTTONS

const btnValue = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];
const btnTitle = ["Tous", "Objets", "Appartements", "Hôtels & restaurants"];

const filterButtons = document.createElement("div");
filterButtons.classList.add("filter");

btnTitle.forEach((category, index) => {
  const button = document.createElement("button");
  button.classList.add("btn");
  button.textContent = category;
  button.setAttribute("value", btnValue[index]);
  filterButtons.appendChild(button);
  project.appendChild(filterButtons);
});

//Déclarer aprés la création sinon le script va trop vite si déclarer en haut
const btnSort = document.querySelectorAll(".btn");
const portfolioSection = document.querySelector("#portfolio");
//Cette méthode insérera les boutons de filtre juste après l'élément h2.
portfolioSection
  .querySelector("h2")
  .insertAdjacentElement("afterend", filterButtons);
//afterend inséré juste après l'élément de référence.

//Ajouter la classe "active" au premier bouton
filterButtons.firstElementChild.classList.add("active");

// *****************************************************************************************************
// Fetch la route Works
//Fetch cards appartenant à WORKS

async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (cards = data));
    console.log(cards);
    workDisplay();
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}

// Fetch cards appartenant à CATEGORIES
// let cardsCategories = [];
// async function fetchApiCategories() {
//   try {
//     await fetch(api + "categories")
//       .then((res) => res.json())
//       .then((data) => (cardsCategories = data));
//     console.log(cardsCategories);
//   } catch (error) {
//     console.log(`Erreur chargement Fonction fetchCategoriesWorks:  ${error}`);
//   }
// }
// fetchApiCategories();

// *****************************************************************************************************
// INJECTION DES CARTES DANS LE HTML

function workDisplay() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = cards
    .filter(
      (card) =>
        //Si categoryIdValue est égal à "Tous", la première expression sera vraie, et toutes les cartes seront affichées.
        //Si categoryIdValue n'est pas égal à "Tous", la seconde expression sera vraie pour les cartes ayant la bonne catégorie,
        //et ces cartes seulement seront affichées.
        categoryIdValue === "Tous" || card.category.name === categoryIdValue
    )
    .map(
      (card) =>
        `<figure>
        <img src="${card.imageUrl}" alt="photo de ${card.title}">
        <figcaption> ${card.title}<figcaption>
        </figure>`
    )
    .join("");
}

// *****************************************************************************************************
//LOGIQUE CLIQUE pour récupérer le "name" du Button et la Class qui s'ajoute

btnSort.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    categoryIdValue = e.target.value;
    btnSort.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
    console.log(categoryIdValue);
    workDisplay();
  });
});

// *****************************************************************************************************
//LOGIQUE AU CHARGEMENT DE LA PAGE

window.addEventListener("load", () => {
  fetchApiWorks();
  categoryIdValue = "Tous";
  checkToken();
});

// *****************************************************************************************************
//Coté ADMINISTRATOR!!!

function checkToken() {
  // Vérifie si le token est présent dans le localStorage
  const token = localStorage.getItem("token");
  if (token !== null) {
    // Le token est présent dans le localStorage
    document.body.style.background = "red";
    adminEdition();
  } else {
    // Le token n'est pas présent dans le localStorage
    document.body.style.background = "yellow";
  }
}

//LOG OUT!! a la fermeture onglet / redirection & Rechargement

function removeToken() {
  // Supprime le token du localStorage
  localStorage.removeItem("token");
}

//événement fermeture onglet ou redirection vers un autre site
window.addEventListener("unload", removeToken);

// *****************************************************************************************************
// *****************************************************************************************************
// *****************************************************************************************************
//ADMIN EDITOR

//Injection Dom en Mode Admin

function adminEdition() {
  //Créer le bandeau Admin Editor
  const flagEditor = document.createElement("div");
  flagEditor.classList.add("flagEditor");
  document
    .querySelector("body")
    .insertAdjacentElement("afterbegin", flagEditor);

  flagEditor.innerHTML = `
      <span class="projectRemove">
        <i class="fa-regular fa-pen-to-square"></i>
        Mode édition 
      </span>
      <button>publier les changements</button>
  `;

  // Créer l'élément <i>
  const editIcon = document.createElement("i");
  editIcon.className = "fa-regular fa-pen-to-square";

  const p = document.createElement("p");
  p.textContent = "Modifier";

  const span = document.createElement("span");
  span.classList.add("sophieRemove");

  span.appendChild(editIcon);
  span.appendChild(p);

  const figure = document.querySelector("#introduction figure");
  const titleProject = document.querySelector("#portfolio > h2");

  // Insérer le premier span dans figure
  figure.appendChild(span);

  // Insérer le deuxième span après titleProject
  titleProject.innerHTML += `
    <span class="projectRemove">
      <i class="fa-regular fa-pen-to-square"></i>
      Modifier 
    </span>
  `;

  //Delete les filtres de Recherche
  filterButtons.remove();

  //Login -> Logout
  document.querySelector(
    "body > header > nav > ul > li:nth-child(3) > a"
  ).innerHTML = `
        <a href="./index.html">
          logout
        </a>
  `;
}

//LOG OUT!

// document.querySelector("#log").addEventListener("click", (e) => {
//   e.preventDefault();
//   const valueClick = e.target.textContent;
//   console.log(valueClick);
//   valueClick === "login" ? (window.location.href = "./assets/login.html") : "";
// });
