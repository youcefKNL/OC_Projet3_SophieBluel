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
  let figure = document.createElement("figure");
  let img = document.createElement("img");
  //   img.src = cards[i].imageUrl;
  //   img.alt = cards[i].title;
  let figcaption = document.createElement("figcaption");
  //   figcaption.textContent = cards[i].title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
  //   gallery.innerHTML = cards.map(
  //     (card) =>
  //       `<figure>
  //       <img src="${cards.imageUrl}"

  //       </figure>`
  //   );
}

// *****************************************************************************************************
//Logique clique
let categoryId;
let cardWork;
btnSort.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    categoryId = e.target.textContent;
    switch (categoryId) {
      case "Tous":
        document.body.style.background = "black";
        break;
      case "Objets":
        document.body.style.background = "red";
        break;
      case "Appartements":
        document.body.style.background = "blue";
        break;
      case "Hôtels& Restaurants":
        document.body.style.background = "yellow";
        break;
      default:
        null;
    }
    workDisplay();
  });
});
