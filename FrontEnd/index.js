const api = "http://localhost:5678/api/";
let categoryIdValue = "";
//let cards = [];

// *****************************************************************************************************
// Fetcher api
// Differentes routes:      /works    /categories    /users/login    /works/{id}
// *****************************************************************************************************
// Fetch la route Works
//Fetch cards appartenant à WORKS

async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (cards = data));
    //Récupération dynamique de toutes les Catégories
    function getButtonTitles(cards) {
      return [...new Set(cards.map((card) => card.category.name))];
    }
    const btnTitle = getButtonTitles(cards);
    console.log(btnTitle);

    console.log(cards);

    filtersBtn(btnTitle);
    workDisplay();
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}

// *****************************************************************************************************
//INJECTION BOUTON EN HTML   (#PORTFOLIO ->) DIV -> BUTTONS

let btnTitle = [];
const btnSort = document.querySelectorAll(".btn");
const filterButtons = document.createElement("div");
const portfolioSection = document.querySelector("#portfolio");
portfolioSection
  .querySelector("h2")
  .insertAdjacentElement("afterend", filterButtons);

function filtersBtn(btnTitle) {
  // Créer le bouton "Tous"
  const allButton = document.createElement("button");
  allButton.classList.add("btn", "active");
  allButton.textContent = "Tous";
  filterButtons.appendChild(allButton);
  filterButtons.classList.add("filter");

  // Destructuring test

  const buttons = [
    allButton,
    ...btnTitle.map((categoryName) => {
      const button = document.createElement("button");
      button.classList.add("btn");
      button.textContent = categoryName;
      filterButtons.appendChild(button);
      return button;
    }),
  ];

  //LOGIQUE CLIQUE pour récupérer le "name" du Button et la Class qui s'ajoute
  //Ne fonctionne que ds la fonction car trop rapide injection sur dom du JS
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      categoryIdValue = e.target.textContent;
      console.log(categoryIdValue);
      buttons.forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      workDisplay();
    });
  });
}

// *****************************************************************************************************
//CORRECTION M => CREATION CARTES WORKS

function cardsTemplate(card) {
  const cardDisplay = document.createElement("figure");

  // INJECTION DE MON IMAGE DS MA CARTE

  const imgCard = document.createElement("img");
  imgCard.setAttribute("src", card.imageUrl);
  imgCard.setAttribute("alt", "photo de " + card.title);

  // INJECTION DU TITRE DS MA CARTE
  const titleCard = document.createElement("figcaption");
  titleCard.textContent = card.title;

  cardDisplay.appendChild(imgCard);
  cardDisplay.appendChild(titleCard);
  portfolioSection.appendChild(cardDisplay);

  // Retourner LES Cartes pour stockage
  return cardDisplay;
}
// *****************************************************************************************************
// INJECTION DES CARTES DANS LE HTML

function workDisplay() {
  const gallery = document.querySelector(".gallery");
  const cardDisplay = new Set();
  gallery.innerHTML = "";
  cards.forEach((card) => {
    if (categoryIdValue === "Tous" || card.category.name === categoryIdValue) {
      cardDisplay.add(card);
    }
  });
  cardDisplay.forEach((card) => {
    gallery.appendChild(cardsTemplate(card));
  });
}

// *****************************************************************************************************

//LOGIQUE AU CHARGEMENT DE LA PAGE

window.addEventListener("load", () => {
  fetchApiWorks();
  categoryIdValue = "Tous";
  checkToken();
});

// *****************************************************************************************************
// *****************************************************************************************************
//Coté ADMINISTRATOR!!!

function checkToken() {
  // Vérifie si le token est présent dans le localStorage
  const token = localStorage.getItem("token");
  if (token) {
    // Le token est présent dans le localStorage
    //document.body.style.background = "red";
    adminEdition();
  } else {
    // Le token n'est pas présent dans le localStorage
    //document.body.style.background = "yellow";
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
// ***************************************  ADMIN EDITOR  **********************************************
// *****************************************************************************************************

//Injection Dom en Mode Admin

function adminEdition() {
  //Créer le bandeau Admin Editor

  const flagEditor = document.createElement("div");
  flagEditor.classList.add("flagEditor");
  document
    .querySelector("body")
    .insertAdjacentElement("afterbegin", flagEditor);

  const spanFlagEditor = document.createElement("span");
  spanFlagEditor.classList.add("projectRemove");
  spanFlagEditor.textContent = "Mode édition";
  //pour le ModalJS
  //spanFlagEditor.classList.add("modalJs");

  //Créer Le SPAN avec le "i"

  const iconFlagEditor = document.createElement("i");
  iconFlagEditor.className = "fa-regular fa-pen-to-square";

  // Insérer l'élément i avant le texte de span
  spanFlagEditor.insertBefore(iconFlagEditor, spanFlagEditor.firstChild);

  const btnFlagEditor = document.createElement("button");
  btnFlagEditor.textContent = "publier les changements";

  flagEditor.appendChild(spanFlagEditor);
  flagEditor.appendChild(btnFlagEditor);

  //Pointage des position à injecter
  const figure = document.querySelector("#introduction figure");
  const titleProject = document.querySelector("#portfolio > h2");

  //clonage du Span au dessus! true = Mm enfant aussi

  const spanFigure = spanFlagEditor.cloneNode(true);
  spanFigure.classList.remove("projectRemove");
  spanFigure.classList.add("figureRemove");

  const spanTitleProject = spanFlagEditor.cloneNode(true);
  spanTitleProject.classList.remove("projectRemove");
  spanTitleProject.setAttribute("id", "titleProjectRemove");

  // INJECTION  SPAN

  figure.appendChild(spanFigure);
  titleProject.appendChild(spanTitleProject);

  //Login -> Logout

  document.querySelector(
    "body > header > nav > ul > li:nth-child(3)"
  ).innerHTML = `
    <a href="./index.html">
    logout
    </a>
    `;

  //Delete les filtres de Recherche
  filterButtons.remove();

  //Open Modal

  //Création du pont avec modal.html

  const modalJs = document.getElementById("titleProjectRemove");

  async function openModal(e) {
    e.preventDefault();
    const target = "./assets/modal.html";
    const response = await fetch(target);
    const html = await response.text();
    //INJECTION DES ELEMENTS FETCHER
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = html;
    // console.log(html);
    document.body.appendChild(modal);
    displayModal();
  }
  modalJs.addEventListener("click", openModal);
  // *****************************************************************************************************

  function displayModal() {
    const closeModalBtn = document.querySelector("#closeModal");
    console.log(closeModalBtn);
    closeModalBtn.addEventListener("click", closeModal);

    function getWorksModal(cards) {
      console.log(cards);
      return [...new Set(cards.map((card) => card.category.name))];
    }
  }

  function closeModal() {
    const modal = document.querySelector(".modal");
    modal.style.display = "none";
    //Delete la div du DOM sinon un second apparait , le 1er se met en none
    document.body.removeChild(modal);
  }
}
