const localStorageKey = "todoList";

let addItemButton = document.getElementById("header-new-item-btn");
let exportItemsBtn = document.getElementById("header-export-btn");

let popupContainer = document.getElementById("popup-container");
let closeFormBtn = document.getElementById("close-form-btn");
let titleInput = document.getElementById("title-input");
let descriptionInput = document.getElementById("description-input");

function initLocalStorage() {
  if (localStorage.getItem(localStorageKey) == null) {
    localStorage.setItem(localStorageKey, "");
  }
}

function addItemToLocalStorage(title, description, date) {
  let item = {
    title: title,
    description: description,
    doneByDate: date
  }

  const existingData = localStorage.getItem(localStorageKey) || "[]";

  const list = JSON.stringify(existingData);

  list.push(item);

  localStorage.setItem(localStorageKey, list);
}

document.addEventListener("DOMContentLoaded", () => {
  initLocalStorage();
});

closeFormBtn.addEventListener("click", () => {
  popupContainer.style.display = "none";
  titleInput.value = "";
  descriptionInput.value = "";
})

addItemButton.addEventListener("click", () => {
  // open popup modal
  popupContainer.style.display = "flex";
});