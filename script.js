const localStorageKey = "todoList";

let addItemButton = document.getElementById("header-new-item-btn");
let importItemsBtn = document.getElementById("header-import-btn");
let exportItemsBtn = document.getElementById("header-export-btn");
let importFilesInput = document.getElementById("import-file-input");

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

function populateUI() {
  const localStorageData = localStorage.getItem(localStorageKey);
  let formattedData = JSON.parse(localStorageData);

  if (localStorageData == "" || localStorageData == null) {
    document.getElementById("no-items-placeholder").style.display = "flex";
  } else {
    document.getElementById("no-items-placeholder").style.display = "none";
  }

  // TODO
}

document.addEventListener("DOMContentLoaded", () => {
  initLocalStorage();
  populateUI();
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

importItemsBtn.addEventListener("click", () => {
  importFilesInput.click();
});

exportItemsBtn.addEventListener("click", () => {
  // TODO
});