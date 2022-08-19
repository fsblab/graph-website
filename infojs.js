let canvas, ctx;
var newItemIsSettable;
var setItemsButton, connectItemsButton;
var mapOfItems, mapOfConnections;
var nameOfItem;
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

    setItemsButton = document.getElementById("setItemName");
    setItemsButton.style.visibility = "hidden";

    connectItemsButton = document.getElementById("connectButton");
    connectItemsButton.style.visibility = "hidden";

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
        setItemsButton.style.visibility = "visible";
    }
}


function drawItemOnCanvas() {
    nameOfItem = document.getElementById("itemName").value;

    if (nameOfItem) {
        drawOneItemOnTheCanvas(numberOfItem, nameOfItem, xPosition, yPosition);

        setItemsButton.style.visibility = "hidden";
        mapOfItems.set(numberOfItem, new NewItem(nameOfItem, xPosition, yPosition, numberOfItem));
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

    mapOfConnections.set(numberOfRadioButtonSelected, arrayOfCheckboxesSelected);


    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    for (i = 0; i < arrayOfCheckboxesSelected.length; i++) {
        ctx.beginPath();
        ctx.moveTo(mapOfItems.get(numberOfRadioButtonSelected).xPos, mapOfItems.get(numberOfRadioButtonSelected).yPos);
        ctx.lineTo(mapOfItems.get(arrayOfCheckboxesSelected[i]).xPos, mapOfItems.get(arrayOfCheckboxesSelected[i]).yPos);
        ctx.stroke();
    }


    numberOfRadioButtonSelected = -1;
    arrayOfCheckboxesSelected = [];
}


function clearEverything() {
    document.getElementById("listOfItems").innerHTML = "<b>List of Items:</b><input id=\"unchechRadioAndCheckboxes\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"uncheckRadioAndCheckboxes()\" name=\"radioButton\"><br>";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    numberOfItem = 0;

    for (i = 0; i < mapOfItems.size; i++) {
        mapOfItems.delete(i);
    }
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
        drawOneItemOnTheCanvas(i, mapOfItems.get(i).nameOfItem, mapOfItems.get(i).xPos, mapOfItems.get(i).yPos);
    }
}


document.addEventListener('DOMContentLoaded', init);



//-----------------------------------------------------------------------------------------------------


function drawOneItemOnTheCanvas(numberOfItem, nameOfItem, xPos, yPos) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(numberOfItem.toString(), xPos, yPos + 6);
    
    document.getElementById("listOfItems").innerHTML += "<br>" + numberOfItem + "&emsp;" + nameOfItem + "<input id=numberOfItem class=\"deleteButton\" onclick=\"deleteItem(this.id)\" type=\"image\" name=\"deleteItem\" src=\"assets/del.png\" alt=\"deleteItem\">".replace("numberOfItem", numberOfItem) + "<input id=\"r\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"setupConnection(this.id)\" name=\"radioButton\">".replace("r", "radioButton" + numberOfItem) + "<input id=\"c\" class=\"radioAndCheckbox\" type=\"checkbox\">".replace("c", "checkbox" + numberOfItem);
    document.getElementById("checkbox" + numberOfItem).style.visibility = "hidden";
}



class NewItem {
    constructor(nameOfItem, xPos, yPos, idOfItem) {
        this.nameOfItem = nameOfItem;
        this.xPos = xPos;
        this.yPos = yPos;
        this.idOfItem = idOfItem;
    }
}