const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");


const listColumns = document.querySelectorAll(".drag-item-list");
const backlogListEl = document.getElementById("backlog-list");
const toDoListEl = document.getElementById("to-do-list");
const doingListEl = document.getElementById("doing-list");
const doneListEl = document.getElementById("done-list");

let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let toDoListArray = [];
let doingListArray = [];
let doneListArray = [];
let listArrays = [];

// Drag functionality
let draggedItem;
let dragging = false;
let currentColumn;

//Get arrays from localstorage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem("backlogItems")) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        toDoListArray = JSON.parse(localStorage.toDoItems);
        doingListArray = JSON.parse(localStorage.doingItems);
        doneListArray = JSON.parse(localStorage.doneItems);
    } else {
        backlogListArray = ["Release the course", "Sit back and relax"];
        toDoListArray = ["Work on project", "Listen to music"];
        doingListArray = ["Being cool", "Getting stuff done"];
        doneListArray = ["Release the course"];
    }
}

// Set localStorage Arrays
function updateSavedColumns() {
    listArrays = [
        backlogListArray,
        toDoListArray,
        doingListArray,
        doneListArray
    ];
    const arrayNames = ["backlog", "toDo", "doing", "done"];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(
            `${arrayName}Items`,
            JSON.stringify(listArrays[index])
        );
    });
}

// filter array to remove empty values
function filterArray(array) {
    return array.filter((item) => item !== null && item.trim() !== "");
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
    const listEl = document.createElement("li");
    listEl.textContent = item;
    listEl.id = index;
    listEl.classList.add("drag-item");
    listEl.draggable = true;
    listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
    listEl.setAttribute("ondragstart", "drag(event)");
    listEl.contentEditable = true;

    listEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            updateItem(index, column);
            listEl.blur();
        }
    });
    columnEl.appendChild(listEl);
}

function updateDOM() {
    if (!updatedOnLoad) {
        getSavedColumns();
    }

    backlogListEl.textContent = "";
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogListEl, 0, backlogItem, index);
    });
    backlogListArray = filterArray(backlogListArray);

    toDoListEl.textContent = "";
    toDoListArray.forEach((toDoItem, index) => {
        createItemEl(toDoListEl, 1, toDoItem, index);
    });
    toDoListArray = filterArray(toDoListArray);

    doingListEl.textContent = "";
    doingListArray.forEach((doingItem, index) => {
        createItemEl(doingListEl, 2, doingItem, index);
    });
    doingListArray = filterArray(doingListArray);

    doneListEl.textContent = "";
    doneListArray.forEach((doneItem, index) => {
        createItemEl(doneListEl, 3, doneItem, index);
    });
    doneListArray = filterArray(doneListArray);

    updatedOnLoad = true;
    updateSavedColumns();
}

// update item
function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumn = listColumns[column].children;
    if (!dragging) {
        if (!selectedColumn[id].textContent) {
            delete selectedArray[id];
        } else {
            selectedArray[id] = selectedColumn[id].textContent;
        }
        updateDOM();
    }
}

// Add to column list
function addToColumn(column) {
    const itemText = addItems[column].value.trim(); 
    if (itemText !== "") {
        const selectedArray = listArrays[column];
        selectedArray.push(itemText); 
        addItems[column].value = ""; 
        updateDOM(); 
    }
}

// Show and hide input box
function showInputBox(column) {
    addBtns[column].style.visibility = "hidden"; 
    saveItemBtns[column].style.display = "flex"; 
    addItemContainers[column].style.display = "flex"; 
}

function hideInputBox(column) {
    addBtns[column].style.visibility = "visible"; 
    saveItemBtns[column].style.display = "none"; 
    addItemContainers[column].style.display = "none"; 
    addToColumn(column); 
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
    backlogListArray = [];
    for (let i = 0; i < backlogListEl.children.length; i++) {
        backlogListArray.push(backlogListEl.children[i].textContent);
    }
    toDoListArray = [];
    for (let i = 0; i < toDoListEl.children.length; i++) {
        toDoListArray.push(toDoListEl.children[i].textContent);
    }
    doingListArray = [];
    for (let i = 0; i < doingListEl.children.length; i++) {
        doingListArray.push(doingListEl.children[i].textContent);
    }
    doneListArray = [];
    for (let i = 0; i < doneListEl.children.length; i++) {
        doneListArray.push(doneListEl.children[i].textContent);
    }
    updateDOM();
}

// Drag and Drop functionality
function dragEnter(column) {
    listColumns[column].classList.add("over");
    currentColumn = column;
}

function drag(e) {
    draggedItem = e.target;
    dragging = true;
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const parent = listColumns[currentColumn];

    listColumns.forEach((column) => {
        column.classList.remove("over");
    });

    parent.appendChild(draggedItem);
    dragging = false;
    rebuildArrays();
}

updateDOM();

// Link add buttons to add items
addBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        showInputBox(index);  
    });
});

saveItemBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        hideInputBox(index);  
    });
});
