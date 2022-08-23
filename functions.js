function drawOneItemOnTheCanvas(numberOfItem, xPos, yPos) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(numberOfItem.toString(), xPos, yPos + 6);
    
    document.getElementById("listOfItems").innerHTML += "<br>" + numberOfItem + "&emsp;" + "<input id=numberOfItem class=\"deleteButton\" onclick=\"deleteItem(this.id)\" type=\"image\" name=\"deleteItem\" src=\"assets/del.png\" alt=\"deleteItem\">".replace("numberOfItem", numberOfItem) + "<input id=\"w\" type=\"text\" class=\"textInput\" value=\"0\">".replace("w", "weightOfConnection" + numberOfItem) + "<input id=\"c\" class=\"radioAndCheckbox\" type=\"checkbox\">".replace("c", "checkbox" + numberOfItem) + "<input id=\"r\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"setupConnection(this.id)\" name=\"radioButton\">".replace("r", "radioButton" + numberOfItem);
    document.getElementById("checkbox" + numberOfItem).style.visibility = "hidden";
    document.getElementById("weightOfConnection" + numberOfItem).style.visibility = "hidden";
}


function drawDirectedConnections(radioButton, checkbox) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mapOfItems.get(radioButton).xPos, mapOfItems.get(radioButton).yPos);
    ctx.lineTo(mapOfItems.get(checkbox).xPos, mapOfItems.get(checkbox).yPos);
    ctx.stroke();
}


function clearListOfItems() {
    document.getElementById("listOfItems").innerHTML = "<b>List of Items:</b><input id=\"unchechRadioAndCheckboxes\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"uncheckRadioAndCheckboxes()\" name=\"radioButton\"><br>";
}


function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearListOfItems();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    for (i = 0; i < mapOfItems.size; i++) {
        for (j = 0; j < mapOfItems.get(i).arrayOfConnections.length; j++) {
            ctx.beginPath();
            ctx.moveTo(mapOfItems.get(i).xPos, mapOfItems.get(i).yPos);
            ctx.lineTo(mapOfItems.get(mapOfItems.get(i).arrayOfConnections[j]).xPos, mapOfItems.get(mapOfItems.get(i).arrayOfConnections[j]).yPos);
            ctx.stroke();
        }
    }


    for (i = 0; i < mapOfItems.size; i++) {
        drawOneItemOnTheCanvas(i, mapOfItems.get(i).xPos, mapOfItems.get(i).yPos);
    }
}