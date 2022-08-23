let canvas, ctx;
var newItemIsSettable;
var setItemsButton, connectItemsButton, deleteConnectionsButton;
var mapOfItems;
var radioButtonsVisibility, checkboxesVisibility;
var numberOfRadioButtonSelected;
var arrayOfCheckboxesSelected, arrayOfWeights;
var weightOfConnectionInput;

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
    arrayOfWeights = [];
    
    mapOfItems = new Map();


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
        document.getElementById("weightOfConnection" + i).style.visibility = "hidden"
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
        document.getElementById("weightOfConnection" + i).style.visibility = "visible";
    }
    connectItemsButton.style.visibility = "visible";
    deleteConnectionsButton.style.visibility = "visible";
}


function setConnection() {
    for (i = 0; i < numberOfItem; i++) {
        if (document.getElementById("checkbox" + i).checked == true) {
            arrayOfCheckboxesSelected.push(i);
            document.getElementById("checkbox" + i).checked = false;
            arrayOfWeights.push(parseInt(document.getElementById("weightOfConnection" + i).value));
        }
        document.getElementById("checkbox" + i).style.visibility = "hidden";
        document.getElementById("radioButton" + i).style.visibility = "visible";
        document.getElementById("radioButton" + i).checked = false;
        document.getElementById("weightOfConnection" + i).style.visibility = "hidden";
    }

    if (numberOfRadioButtonSelected == -1 || arrayOfCheckboxesSelected.length == 0) {
        return;
    }

    connectItemsButton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";

    mapOfItems.get(numberOfRadioButtonSelected).connectTo(arrayOfCheckboxesSelected, arrayOfWeights);

    numberOfRadioButtonSelected = -1;
    arrayOfCheckboxesSelected = [];
    arrayOfWeights = [];

    redrawCanvas();
}


function deleteConnectionOfSelectedItem() {
    mapOfItems.get(numberOfRadioButtonSelected).connectTo([], []);

    for (i = 0; i < numberOfItem; i++) {
        document.getElementById("checkbox" + i).style.visibility = "hidden";
        document.getElementById("radioButton" + i).style.visibility = "visible";
        document.getElementById("radioButton" + i).checked = false;
        document.getElementById("weightOfConnection" + i).style.visibility = "hidden";
    }

    connectItemsButton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";

    redrawCanvas();
}


function clearEverything() {
    clearListOfItems();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    numberOfItem = 0;

    for (i = 0; i < mapOfItems.size; i++) {
        mapOfItems.delete(i);
    }

    connectItemsButton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";
}


function deleteItem(clickedId) {
    clearListOfItems();
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