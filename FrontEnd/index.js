const api = "http://localhost:5678/api/";
const token = localStorage.getItem("token");
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

const imageUrls = [];

function cardsTemplate(card) {
  const cardDisplay = document.createElement("figure");
  // data set pour étape édition ds Modal
  cardDisplay.setAttribute("data-card-id", card.id);
  //console.log(cardDisplay);
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

window.addEventListener("load", (e) => {
  fetchApiWorks();
  categoryIdValue = "Tous";
  checkToken();
});

// *****************************************************************************************************
// *****************************************************************************************************
//Coté ADMINISTRATOR!!!

function checkToken() {
  // Vérifie si le token est dans le localStorage
  const token = localStorage.getItem("token");
  if (token) {
    //document.body.style.background = "red";
    adminEdition();
  } else {
    //document.body.style.background = "yellow";
  }
}

//LOG OUT!! a la fermeture onglet / redirection & Rechargement

function removeToken() {
  // Supprime le token du localStorage
  localStorage.removeItem("token");
  sessionStorage.removeItem("deletedImages");
}

//événement fermeture onglet ou redirection vers un autre site

window.addEventListener("unload", removeToken);

// *****************************************************************************************************
// ***************************************  ADMIN EDITOR  **********************************************
// *****************************************************************************************************

function adminEdition() {
  // *****************************************************************************************************
  //*************************************PARTIE SITE AVEC AJOUT DES ELTMTS EDITOR SUR DOM
  // *****************************************************************************************************

  let deletedImages = {};
  //*************************************Créer le bandeau Admin Editor
  const flagEditor = document.createElement("div");
  flagEditor.classList.add("flagEditor");
  document
    .querySelector("body")
    .insertAdjacentElement("afterbegin", flagEditor);

  const spanFlagEditor = document.createElement("span");
  spanFlagEditor.classList.add("projectRemove");
  spanFlagEditor.textContent = "Mode édition";

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

  spanTitleProject.setAttribute("href", "#modal");
  // INJECTION  SPAN

  figure.appendChild(spanFigure);
  titleProject.appendChild(spanTitleProject);

  //*************************************Login -> Logout

  // Sélectionner l'élément <li> à modifier
  const logout = document.querySelector(
    "body > header > nav > ul > li:nth-child(3)"
  );

  // Créer un élément <a> pour le lien de déconnexion
  const logoutLink = document.createElement("a");
  logoutLink.href = "./index.html";

  const logoutText = document.createTextNode("logout");
  logoutLink.appendChild(logoutText);

  logout.innerHTML = "";
  logout.appendChild(logoutLink);

  //  DECONEXion
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    removeToken();
    window.location.assign("./index.html");
  });

  //*************************************Delete les filtres de Recherche
  filterButtons.remove();

  // *****************************************************************************************************
  //*************************************OPEN 1ER MODAL EDIT SUPRESSION
  // *****************************************************************************************************

  const modalJs = document.getElementById("titleProjectRemove");
  console.log(modalJs);

  modalJs.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    //console.log(target);
    target.style.display = null;
    displayModal();
    openModal();
    editModal();
  });

  async function openModal() {
    //evitez les doublettes images Gallery
    const galleryMapModal = document.getElementById("modalGrid");
    galleryMapModal.innerHTML = "";

    //*************************************INJECTION DES ELEMENTS FETCHER
    // Récupérer les liens des images
    // const imagesUrl = await cards.map((card) => card.imageUrl);
    const imagesUrl = [...document.querySelectorAll(".gallery img")].map(
      (img) => img.getAttribute("src")
    );

    console.log(imagesUrl);

    // Créer un Set pour n'avoir que des liens uniques
    const imagesUrlSet = new Set(imagesUrl);

    //*************************************INJECTIONS DES CARTES DS MODAL
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const imageElements = [...imagesUrlSet].map((link, index) => {
      const container = document.createElement("figure");
      const img = document.createElement("img");
      const p = document.createElement("p");
      const iconDelete = document.createElement("i");

      // ajouter l'attribut data-card-id
      container.setAttribute("data-card-id", cards[index].id);
      iconDelete.id = "deleteIcon";
      iconDelete.classList.add("fa-solid", "fa-trash-can", "iconModal");

      iconDelete.setAttribute("aria-hidden", "true");

      img.src = link;
      img.alt = "";
      p.textContent = "éditer";
      container.appendChild(img);
      container.appendChild(p);
      container.appendChild(iconDelete);

      // Ajouter l'icône de déplacement uniquement sur le premier élément

      if (index === 0) {
        const iconMove = document.createElement("i");
        iconMove.id = "moveIcon";
        iconMove.classList.add(
          "fa-solid",
          "fa-arrows-up-down-left-right",
          "iconModal"
        );
        container.appendChild(iconMove);
      }

      //DELETE icone Corbeille
      iconDelete.addEventListener("click", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const cardDelete = e.target.parentNode.getAttribute("data-card-id");
        // console.log(cardDelete);
        removeElement(cardDelete);
        deletedImages[cardDelete] = true;

        console.log(deletedImages);

        // Convertir l'objet en chaîne de caractères JSON
        const deletedImagesJSON = JSON.stringify(deletedImages);

        // Stocker la chaîne dans sessionStorage
        sessionStorage.setItem("deletedImages", deletedImagesJSON);
      });

      //FONCTION DELETE SUR LE DOM UNIQUEMENT:

      function removeElement(cardDelete) {
        const card = document.querySelector(`[data-card-id="${cardDelete}"]`);
        if (card && card.parentNode) {
          card.parentNode.removeChild(card);
          container.remove(card);
        }
      }

      //FONCTION DELETE ALL DU DOM DEPUIS MODAL
      const deleteALL = document.querySelector("#deleteAllWorks");
      deleteALL.addEventListener("click", () => {
        const figureModals = document.querySelectorAll("#modalGrid figure");
        const galleryModals = document.querySelectorAll("#portfolio figure");
        const deletedImages =
          JSON.parse(sessionStorage.getItem("deletedImages")) || {};
        const imageIds = [];

        figureModals.forEach((figure) => {
          const dataCardId = figure.getAttribute("data-card-id");
          imageIds.push(dataCardId);

          // stocke l'ID deletedImages
          deletedImages[dataCardId] = true;
        });

        // DELETE TOUTES LES CARTES

        figureModals.forEach((figure) => figure.remove());
        galleryModals.forEach((figure) => figure.remove());

        // Stocke les ID SESSIONTORAGE
        sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));
      });

      return container;
    });

    const galleryMap = document.getElementById("modalGrid");
    galleryMap.append(...imageElements);
  }

  //*************************************SUPRESSION DES TRAVAUX DE L'API

  const deleteWorksApi = document.querySelector("body > div > button");
  console.log(deleteWorksApi);

  //Confirmation DELETE CARTES dans L'API
  deleteWorksApi.addEventListener("click", (e) => {
    e.preventDefault();

    // Récupérer la chaîne de sessionStorage
    const deletedImagesJSON = sessionStorage.getItem("deletedImages");

    // Convertir la chaîne en objet JavaScript
    const deletedImages = JSON.parse(deletedImagesJSON);

    // Supprimer chaque image du SESSION STORAGE
    //méthode JavaScript qui renvoie un tableau contenant les clés d'un objet
    Object.keys(deletedImages).forEach(async (id) => {
      try {
        if (token === false) return console.log({ error: "Pas connecté" });

        const response = await fetch(`${api}works/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          console.log(`Image avec ID ${id} supprimée`);
        } else {
          throw new Error(response.statusText);
        }
      } catch (e) {
        console.error(
          `Erreur lors de la suppression de l'image avec ID ${id}: ${e}`
        );
      }
    });
  });

  function disableScroll() {
    document.body.classList.add("modalOpen");
  }

  function enableScroll() {
    document.body.classList.remove("modalOpen");
  }

  function displayModal() {
    disableScroll();
    const modal = document.querySelector("#modal");
    const closeModalBtn = document.querySelector("#closeModal");
    console.log(closeModalBtn);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  function closeModal() {
    const categoryModalAddProject = document.querySelector("#category");
    const viewImage = document.getElementById("addImageContainer");
    const editTitleModalAddProject = document.querySelector("#title");
    const gallerySection = document.querySelector("#modalEdit");
    const editSection = document.querySelector("#editSection");
    const modal = document.getElementById("modal");
    const previewModal = document.querySelector("#previewModal");
    console.log(previewModal);

    //***************Cache Modal */
    modal.style.display = "none";
    gallerySection.style.display = "";
    previewModal.style.display = "none";
    editSection.style.display = "none";

    //**************Reset Modal Ajout travail */
    editTitleModalAddProject.value = "";
    categoryModalAddProject.value = "";
    viewImage.innerHTML = `						<i class="fa-solid fa-image"></i>

    <div id="inputFile">
      <label for="filetoUpload" class="fileLabel">
        <span>+ Ajouter une photo</span>
        <input type="file" id="filetoUpload" name="image" accept="image/png, image/jpeg"
          class="file-input">
      </label>
    </div>
    <span class="filesize">jpg, png : 4mo max</span>
    <span id="errorImg"></span>`;
    // viewImage.replaceWith(clonedViewImage);
    //***************************** */
    enableScroll();
    //Delete la div du DOM sinon un second apparait , le 1er se met en none Valable pour 1er test en AJAX:
    //document.body.removeChild(modal);
  }

  // *****************************************************************************************************
  //*************************************MODAL AJOUT TRAVAUX
  // *****************************************************************************************************

  //AJOUTER UNE PHOTO
  function editModal() {
    const viewImage = document.getElementById("addImageContainer");

    const addProject = document.getElementById("editModal");
    const gallerySection = document.querySelector("#modalEdit");
    const editSection = document.querySelector("#editSection");
    const previewModal = document.querySelector("#previewModal");
    const selectCategory = document.getElementById("category");
    const inputFile = document.getElementById("filetoUpload");
    const errorImg = document.getElementById("errorImg");
    const addToApi = document.getElementById("editWorks");
    const titleError = document.querySelector("#ErrorTitleSubmit");
    const categoryError = document.querySelector("#ErrorCategorySubmit");
    const submitForm = document.querySelector(
      "#editWorks > div.footerModal.editFooter > input[type=submit]"
    );
    let iCanSubmit = false;
    //console.log(previewModal);

    //*************************************Cache - Cache differentes section Madale
    addProject.addEventListener("click", () => {
      gallerySection.style.display = "none";
      editSection.style.display = "";
      previewModal.style.display = "initial";
    });
    previewModal.addEventListener("click", () => {
      gallerySection.style.display = "";
      editSection.style.display = "none";
      previewModal.style.display = "none";
    });

    //*************************************PARTIE IMG
    inputFile.addEventListener("change", function () {
      const file = inputFile.files[0];
      // 4Mo en octets => Message ERROR
      const maxSize = 4 * 1024 * 1024;

      if (file.size > maxSize) {
        errorImg.textContent = "Votre image est trop volumineuse";
        console.log("fichier > 4MO!");
        return;
      }

      const reader = new FileReader();

      reader.addEventListener("load", function () {
        viewImage.innerHTML = "";
        const img = document.createElement("img");
        img.setAttribute("src", reader.result);
        viewImage.appendChild(img);
        viewImage.style.padding = "0";
      });

      reader.readAsDataURL(file);
    });
    //*************************************AJOUT TITRE
    // editTitle.addEventListener("input", () => {
    //   editTitleProject = editTitle.value;
    // });

    //*************************************PARTIE CATEGORIE
    const categories = new Set(cards.map((card) => card.category.name));

    if (selectCategory.options.length === 0) {
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "";
      selectCategory.appendChild(emptyOption);

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        selectCategory.appendChild(option);
      });
    }
    //************************************* Condition Formulaire

    editSection.addEventListener("input", () => {
      const editTitle = document.querySelector("#title");
      iCanSubmit = false;
      titleSelected = false;
      categorySelected = false;
      submitForm.style.background = " grey";
      let category = document.querySelector("#category").value;
      const title = editTitle.value;
      const image = inputFile.files[0];
      // console.log(typeof image);

      if (image === null || image === undefined) {
        errorImg.textContent = "Veuillez selectionnez une image";
        imageSelected = false;
      } else if (title.length < 3) {
        titleError.textContent = "Ajoutez un titre";
        titleSelected = false;
      } else if (category === "") {
        categoryError.textContent = "Choisissez une catégorie";
        titleError.textContent = "";
        categorySelected = false;
      } else {
        //submitForm.style.background = " #1d6154";
        titleError.textContent = "";
        categoryError.textContent = "";
        categorySelected = true;
        titleSelected = true;
        imageSelected = true;

        //iCanSubmit = true;
      }
      if (titleSelected && categorySelected && imageSelected) {
        submitForm.style.background = " #1d6154";
        iCanSubmit = true;
      }
    });

    addToApi.addEventListener("submit", (e) => {
      console.log("Formulaire soumis !");
      e.preventDefault();

      //console.log("test");
      //*************************************Récupérer les valeurs INPUTs
      if (iCanSubmit) {
        const image = inputFile.files[0];
        //console.log(image);
        const title = document.querySelector("#title").value;
        let category = document.querySelector("#category").value;

        //Récupérer et donne le bon id input Category

        if (category === "Objets") {
          category = 1;
        } else if (category === "Appartements") {
          category = 2;
        } else if (category === "Hotels & restaurants") {
          category = 3;
        }

        category = parseInt(category);

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", category);
        //submitForm.disabled = true;
        console.log(formData);

        fetch(api + "works", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Ta requête POST n'est pas passé :/ ");
            }

            return response.json();
          })
          .then((data) => {
            console.log("Ta requête POST est passé :) :", data);
            fetchApiWorks();
            workDisplay();
            closeModal();
            // réinitialiser le champ inputFile sinon il envoie plusieur formData en post
            inputFile.value = "";
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        console.log("Ta requête POST n'est PAS passé :( :", data);
      }
    });
  }
}
