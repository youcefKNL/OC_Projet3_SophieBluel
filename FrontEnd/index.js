//Pointer les Filtres
const btnSort = document.querySelectorAll(".btn");
// console.log(btnSort);

// *****************************************************************************************************
// Fetcher api
// Fetch la route Works

// import { fetchApiCategories } from "./fetchApiWorks";

// Differentes routes:      /works    /categories    /users/login    /works/{id}
const api = "http://localhost:5678/api/";

//Fetch cards appartenant à WORKS

let cards = [];
async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (cards = data));
    console.log(cards);
  } catch (error) {
    console.log(`Erreur chargement Fonction fetchApiWorks:  ${error}`);
  }
}
fetchApiWorks();

// Fetch cards appartenant à CATEGORIES
let cardsCategories = [];
async function fetchApiCategories() {
  try {
    await fetch(api + "categories")
      .then((res) => res.json())
      .then((data) => (cardsCategories = data));
    console.log(cardsCategories);
  } catch (error) {
    console.log(`Erreur chargement Fonction fetchCategoriesWorks:  ${error}`);
  }
}
fetchApiCategories();

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
        <img src="${card.imageUrl}">
        <figcaption> ${card.title}<figcaption>
        </figure>`
    )
    .join("");
}

// *****************************************************************************************************
//Logique clique
let categoryIdValue;

btnSort.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    categoryIdValue = e.target.textContent;

    switch (categoryIdValue) {
      case "Tous":
        document.body.style.background = "black";
        break;
      case "Objets":
        document.body.style.background = "red";

        break;
      case "Appartements":
        document.body.style.background = "blue";

        break;
      case "Hotels & restaurants":
        document.body.style.background = "yellow";
        break;
      default:
        null;
    }
    console.log(categoryIdValue);
    workDisplay();
  });
});
