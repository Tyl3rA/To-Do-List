const localStorageKey = "todoList";

let addItemButton = document.getElementById("header-new-item-btn");
let importItemsBtn = document.getElementById("header-import-btn");
let exportItemsBtn = document.getElementById("header-export-btn");
let importFilesInput = document.getElementById("import-file-input");
// let addItemButton2;
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

function handleCheckboxChange(id, checkbox) {
  let existingData = loadTasks();

  if (checkbox.checked) {
    for (let item of existingData) {
      if (item.id == id) {
        item.completed = true;
      }
    }
  } else {
    for (let item of existingData) {
      if (item.id == id) {
        item.completed = false;
      }
    }
  }

  saveItems(existingData);
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
  // container.innerHTML = `<div id="no-items-placeholder"><span>No items yet.</span><button id="body-new-item-btn">+ Add new item</button></div>`;
  container.innerHTML = `<div id="no-items-placeholder"><span>No items yet.</span></div>`;
  // addItemButton2 = document.getElementById("body-new-item-btn"); // has to be in here because it is populated by JS after var declared at top level
  let existingData = loadTasks();
  if (existingData.length === 0) {
    document.getElementById("no-items-placeholder").style.display = "flex";
  } else {
    document.getElementById("no-items-placeholder").style.display = "none";
  }

  for (let i = 0; i <= existingData.length - 1; i++) {
    let title = existingData[i].title;
    let description = existingData[i].description;
    let id = existingData[i].id;
    let completed = existingData[i].completed;

    if (completed) {
      container.innerHTML += `<div class="todo-item">
        <span class="todo-item-title">${title}</span>
        <span class="todo-item-description">${description}</span>
        <div>
          <label for="todo-checkbox">Completed?</label>
          <input onchange="handleCheckboxChange('${id}', this)" type="checkbox" name="todo-checkbox" id="todo-checkbox" class="todo-checkbox" checked>
        </div>
        <div>
          <button class="secondary" onclick="openEditModal('${id}', '${title}', '${description}')" class="todo-edit">Edit</button>
          <button class="secondary" onclick="deleteItem('${id}')" class="todo-delete">Delete</button>
        </div>
       </div>`;
    } else {
      container.innerHTML += `<div class="todo-item">
        <span class="todo-item-title">${title}</span>
        <span class="todo-item-description">${description}</span>
        <div>
          <label for="todo-checkbox">Completed?</label>
          <input onchange="handleCheckboxChange('${id}', this)" type="checkbox" name="todo-checkbox" id="todo-checkbox" class="todo-checkbox">
        </div>
        <div>
          <button class="secondary" onclick="openEditModal('${id}', '${title}', '${description}')" class="todo-edit">Edit</button>
          <button class="secondary" onclick="openDeletePopupModal('${id}')" class="todo-delete">Delete</button>
        </div>
        </div>`;
    }
  }
}

function openDeletePopupModal(id) {
  a.innerHTML += `
    <div id="delete-popup-container">
      <span id="delete-popup-container-text">Are you sure you want to delete this item?</span>
      <button onclick="closeDeletePopup()" id="delete-button-cancel">Cancel</button>
      <button onclick="deleteItem('${id}')" id="proceed-button-cancel">Proceed</button>
    </div>
  `
}

function closeDeletePopup() {
  document.getElementById("delete-popup-container").style.display = "none";
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

// addItemButton2.addEventListener("click", () => {
  // open popup modal
  // popupContainer.style.display = "flex";
// });

importItemsBtn.addEventListener("click", () => {
  importFilesInput.click();
});

importFilesInput.addEventListener("change", async function(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  let reader = new FileReader();

  reader.onload = function(f) {
    try {
      let existingData = loadTasks();
      const importedData = JSON.parse(f.target.result);

      if (!Array.isArray(importedData)) {
        alert("JSON file must contain an array of items");
        return;
      }

      const validTasks = importedData.filter(item =>
        item &&
        typeof item.id == "string" &&
        typeof item.title == "string" && 
        typeof item.description == "string"
      );

      if (validTasks.length !== importedData.length) {
        alert("Some tasks have been removed for improper formatting");
      }

      let mergedData = new Map(existingData.map(item => [item.id, item]));

      for (let item of importedData) {
        mergedData.set(item.id, {
          ...item,
          completed: Boolean(item.completed)
        });
      }

      saveItems(Array.from(mergedData.values()));
      renderItems();
    } catch (e) {
      console.error("Error importing JSON: ", e);
      alert("Invalid JSON");
    }
  }

  reader.onerror = function() {
    alert("Error reading file");
    return;
  }

  reader.readAsText(file);
});

exportItemsBtn.addEventListener("click", () => {
  let data = JSON.stringify(loadTasks());
  let blob = new Blob([data], { type: 'application/json' });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "todo_items.json";

  link.click();

  URL.revokeObjectURL(url);
});

submitFormBtn.addEventListener("click", () => {
  if (!editMode) {
    let title = titleInput.value;
    let description = descriptionInput.value;
    addItem(title, description);
  }
});