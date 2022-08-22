let canvas, ctx;
var newItemIsSettable;
var setItemsButton, connectItemsButton, deleteConnectionsButton;
var mapOfItems, mapOfConnections;
var radioButtonsVisibility, checkboxesVisibility;
var numberOfRadioButtonSelected;
var arrayOfCheckboxesSelected;

//some properties concerning every circle
const radius = 16;
var numberOfItem = 0;
var xPosition, yPosition;


function init () {
    canvas = document.getElementById("pinBoard");
    ctx = canvas.getContext("2d");
    newItemIsSettable = false;

    connectItemsButton = document.getElementById("connectButton");
    connectItemsButton.style.visibility = "hidden";

    deleteConnectionsButton = document.getElementById("deleteConnectionsButton");
    deleteConnectionsButton.style.visibility = "hidden";

    numberOfRadioButtonSelected = -1;
    arrayOfCheckboxesSelected = [];
    
    mapOfItems = new Map();
    mapOfConnections = new Map();


    //source for the following: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    ctx.scale(dpr, dpr);

    // Set the "drawn" size of the canvas
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;


    //this has to come afterwards all that code above. If it comes before it will have no effect
    ctx.font = "16px Arial";
}


function setCursorToNormal() {
    document.body.style.cursor = "";
    newItemIsSettable = false;
}


function setCursorToCrosshair() {
    document.body.style.cursor = "crosshair";
    newItemIsSettable = true;
}


function setNewItem(e) {
    var rect = canvas.getBoundingClientRect();
    xPosition = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    yPosition = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

    if (newItemIsSettable) {
        drawOneItemOnTheCanvas(numberOfItem, xPosition, yPosition);

        mapOfItems.set(numberOfItem, new NewItem(numberOfItem, xPosition, yPosition));
        numberOfItem++;
    }
}


function uncheckRadioAndCheckboxes() {
    for (i = 0; i < numberOfItem; i++) {
        document.getElementById("checkbox" + i).style.visibility = "hidden";
        document.getElementById("checkbox" + i).checked = false;
        document.getElementById("radioButton" + i).style.visibility = "visible";
    }
    connectItemsButton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";
}


function setupConnection(idOfRadioButton) {
    for (i = 0; i < numberOfItem; i++) {
        if (i == parseInt(idOfRadioButton.replace("radioButton", ""))) {
            numberOfRadioButtonSelected = i;
            continue;
        }
        document.getElementById("radioButton" + i).style.visibility = "hidden";
        document.getElementById("checkbox" + i).style.visibility = "visible";
    }
    connectItemsButton.style.visibility = "visible";
    deleteConnectionsButton.style.visibility = "visible";
}


function setConnection() {
    for (i = 0; i < numberOfItem; i++) {
        if (document.getElementById("checkbox" + i).checked == true) {
            arrayOfCheckboxesSelected.push(i);
            document.getElementById("checkbox" + i).checked = false;
        }
        document.getElementById("checkbox" + i).style.visibility = "hidden";
        document.getElementById("radioButton" + i).style.visibility = "visible";
        document.getElementById("radioButton" + i).checked = false;
    }

    if (numberOfRadioButtonSelected == -1 || arrayOfCheckboxesSelected.length == 0) {
        return;
    }

    connectItemsButton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";

    mapOfConnections.set(numberOfRadioButtonSelected, arrayOfCheckboxesSelected);


    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    for (i = 0; i < arrayOfCheckboxesSelected.length; i++) {
        drawArrowBetweenItems(mapOfItems, numberOfRadioButtonSelected, arrayOfCheckboxesSelected[i])
    }


    numberOfRadioButtonSelected = -1;
    arrayOfCheckboxesSelected = [];

    //TODO: redraw the canvas
}


function deleteConnectionOfSelectedItem() {
    mapOfConnections.delete(numberOfRadioButtonSelected);

    connectItemsButton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";

    //TODO: redraw the canvas
}


function clearEverything() {
    document.getElementById("listOfItems").innerHTML = "<b>List of Items:</b><input id=\"unchechRadioAndCheckboxes\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"uncheckRadioAndCheckboxes()\" name=\"radioButton\"><br>";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    numberOfItem = 0;

    for (i = 0; i < mapOfItems.size; i++) {
        mapOfItems.delete(i);
    }

    connectItemsButton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";
}


function deleteItem(clickedId) {
    document.getElementById("listOfItems").innerHTML = "<b>List of Items:</b><input id=\"unchechRadioAndCheckboxes\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"uncheckRadioAndCheckboxes()\" name=\"radioButton\"><br>";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = parseInt(clickedId); i < mapOfItems.size; i++) {
        mapOfItems.delete(i);
        mapOfItems.set(i, mapOfItems.get(i + 1));
    }

    mapOfItems.delete(mapOfItems.size - 1);
    numberOfItem--;

    for (i = 0; i < mapOfItems.size; i++) {
        drawOneItemOnTheCanvas(i, mapOfItems.get(i).xPos, mapOfItems.get(i).yPos);
    }
}


document.addEventListener('DOMContentLoaded', init);