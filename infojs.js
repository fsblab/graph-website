let canvas, ctx;
var newItemIsSettable;
var setItems;
var hashmapOfItems;
var nameOfItem;

//some properties concerning every circle
const radius = 16;
var numberOfItem = 0;
var xPosition, yPosition;


function init () {
    canvas = document.getElementById("pinBoard");
    ctx = canvas.getContext("2d");
    newItemIsSettable = false;
    setItems = document.getElementById("setItemName");
    setItems.style.visibility = "hidden";

    hashmapOfItems = new Map();


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
        setItems.style.visibility = "visible";
    }
}


function drawItemOnCanvas() {
    nameOfItem = document.getElementById("itemName").value;

    if (nameOfItem) {
        ctx.beginPath();
        ctx.arc(xPosition, yPosition, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(numberOfItem.toString(), xPosition, yPosition + 6);
        
        setItems.style.visibility = "hidden";

        hashmapOfItems.set(numberOfItem, new NewItem(nameOfItem, xPosition, yPosition, numberOfItem));

        document.getElementById("listOfItems").innerHTML += "<br>" + numberOfItem + "&emsp;" + nameOfItem + "<input id=numberOfItem class=\"deleteButton\" onclick=\"deleteItem(this.id)\" type=\"image\" name=\"deleteItem\" src=\"assets/del.png\" alt=\"deleteItem\">".replace("numberOfItem", numberOfItem);
        numberOfItem++;
    }
}


function deleteItem(clickedId) {
    document.getElementById("listOfItems").innerHTML = "<b>List of Items:</b><br>";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = parseInt(clickedId); i < hashmapOfItems.size; i++) {
        hashmapOfItems.delete(i);
        hashmapOfItems.set(i, hashmapOfItems.get(i + 1));
    }

    hashmapOfItems.delete(hashmapOfItems.size - 1);
    numberOfItem--;

    for (i = 0; i < hashmapOfItems.size; i++) {
        ctx.beginPath();
        ctx.arc(hashmapOfItems.get(i).xPos, hashmapOfItems.get(i).yPos, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(i.toString(), hashmapOfItems.get(i).xPos, hashmapOfItems.get(i).yPos + 6);

        document.getElementById("listOfItems").innerHTML += "<br>" + i + "&emsp;" + hashmapOfItems.get(i).nameOfItem + "<input id=numberOfItem class=\"deleteButton\" onclick=\"deleteItem(this.id)\" type=\"image\" name=\"deleteItem\" src=\"assets/del.png\" alt=\"deleteItem\">".replace("numberOfItem", i);
    }
}


document.addEventListener('DOMContentLoaded', init);



//-----------------------------------------------------------------------------------------------------



class NewItem {
    constructor(nameOfItem, xPos, yPos, idOfItem) {
        this.nameOfItem = nameOfItem;
        this.xPos = xPos;
        this.yPos = yPos;
        this.idOfItem = idOfItem;
    }
}