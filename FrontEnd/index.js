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

const categories = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];

const filterButtons = document.createElement("div");
filterButtons.classList.add("filter");

categories.forEach((category) => {
  const button = document.createElement("button");
  button.classList.add("btn");
  button.textContent = category;
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
// filterButtons est l'élément HTML que l'on souhaite insérer
//afterend signifie que l'élément doit être inséré juste après l'élément de référence.

// *****************************************************************************************************
// Fetch la route Works
//Fetch cards appartenant à WORKS

async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (cards = data));
    console.log(cards);
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
// LOGIQUE INJECTION DES CARTES DANS LE HTML

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
    categoryIdValue = e.target.textContent;
    btnSort.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
    console.log(categoryIdValue);
    workDisplay();
  });
});

window.addEventListener("load", fetchApiWorks);
