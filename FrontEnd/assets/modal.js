const closeModalBtn = modalJs.document.querySelector("#closeModal");
console.log(closeModalBtn);

closeModalBtn.addEventListener("click", closeModal);

// Fonction pour fermer la modal
function closeModal() {
  const modal = modalJs.document.querySelector("#myModal");
  modal.style.display = "none";
}
