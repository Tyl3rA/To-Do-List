const localStorageKey = "todoList";

let addItemButton = document.getElementById("header-new-item-btn");
let importItemsBtn = document.getElementById("header-import-btn");
let exportItemsBtn = document.getElementById("header-export-btn");
let importFilesInput = document.getElementById("import-file-input");

let popupContainer = document.getElementById("popup-container"); // reused for both adding an item and editing an item
let closeFormBtn = document.getElementById("close-form-btn");
let submitFormBtn = document.getElementById("form-submit");
let titleInput = document.getElementById("title-input");
let descriptionInput = document.getElementById("description-input");
let container = document.getElementById("container");

function initLocalStorage() {
  if (localStorage.getItem(localStorageKey) == null) {
    localStorage.setItem(localStorageKey, "[]");
  }
}

let tasks = loadTasks();

function saveItems(items) {
  localStorage.setItem(localStorageKey, JSON.stringify(items));
}

function addItem(title, description) {
  if (title.trim() == "" || description.trim() == "") {
    return;
  }

  let existingData = loadTasks();
  let item = {
    id: crypto.randomUUID(),
    title: title,
    description: description,
    completed: false,
  }

  existingData.push(item);

  saveItems(existingData);
  renderItems();
}

let editMode = false;

function openEditModal(id, title, description) {
  editMode = true;
  console.log("Edit mode set to true");
  popupContainer.style.display = "flex";
  titleInput.value = title;
  descriptionInput.value = description;
  submitFormBtn.innerText = "Edit";
  submitFormBtn.onclick = () => editItem(id);
}

function closeEditModal() {
  editMode = false;
  console.log("Edit mode set to false");
  popupContainer.style.display = "none";
  titleInput.value = "";
  descriptionInput.value = "";
  submitFormBtn.innerText = "Add";
  submitFormBtn.onclick = "";
}

function editItem(id) {
  let existingData = loadTasks();
  let title = titleInput.value;
  let description = descriptionInput.value;

  for (let item of existingData) {
    if (item.id == id) {
      item.title = title;
      item.description = description;
    }
  }

  saveItems(existingData);
  renderItems();
  closeEditModal();
}

function deleteItem(id) {
  let existingData = loadTasks();
  let remaining = existingData.filter(i => i.id !== id);
  saveItems(remaining);
  renderItems();
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey)) || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

function renderItems() {
  container.innerHTML = `<div id="no-items-placeholder"><span>No items yet.</span></div>`;
  let existingData = loadTasks();
  if (existingData.length === 0) {
    document.getElementById("no-items-placeholder").style.display = "flex";
  } else {
    document.getElementById("no-items-placeholder").style.display = "none";
  }



  for (let i = 0; i <= existingData.length - 1; i++) {
    let title = existingData[i].title;
    let description = existingData[i].description;

    container.innerHTML += `<div class="todo-item">
        <span class="todo-item-title">${title}</span>
        <span class="todo-item-description">${description}</span>
        <div>
          <label for="todo-checkbox">Completed?</label>
          <input type="checkbox" name="todo-checkbox" id="todo-checkbox" class="todo-checkbox">
        </div>
        <div>
          <button onclick="openEditModal('${existingData[i].id}', '${title}', '${description}')" class="todo-edit">Edit</button>
          <button onclick="deleteItem('${existingData[i].id}')" class="todo-delete">Delete</button>
        </div>
       </div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLocalStorage();
  renderItems();
});

closeFormBtn.addEventListener("click", () => {
  if (!editMode) {
    popupContainer.style.display = "none";
    titleInput.value = "";
    descriptionInput.value = "";
  } else {
    closeEditModal();
  }
})

addItemButton.addEventListener("click", () => {
  // open popup modal
  popupContainer.style.display = "flex";
});

importItemsBtn.addEventListener("click", () => {
  importFilesInput.click();
});

importFilesInput.addEventListener("change", async function(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  try {
    let text = await file.text();

    let rows = text.split("\n").map(row => {
      row.split(",");
    });

    console.log("Parsed imported file:\n", rows);

    // TODO import files into local storage and rebuild UI
  } catch (error) {
    console.error("Error in importing file:", error);
  }
});

exportItemsBtn.addEventListener("click", () => {
  let content = loadTasks();
  let filename = "todo_data.csv";
  const blob = new Blob([content], { type: mimeType });
  const blobUrl = URL.createObject(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
  
    document.body.appendChild(a);
    a.click();
  
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl); 
});

submitFormBtn.addEventListener("click", () => {
  if (!editMode) {
    let title = titleInput.value;
    let description = descriptionInput.value;
    addItem(title, description);
  }
});