function drawOneItemOnTheCanvas(numberOfItem, xPos, yPos) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(numberOfItem.toString(), xPos, yPos + 6);
    
    document.getElementById("listOfItems").innerHTML += "<br>" + numberOfItem + "&emsp;" + "<input id=numberOfItem class=\"deleteButton\" onclick=\"deleteItem(this.id)\" type=\"image\" name=\"deleteItem\" src=\"assets/del.png\" alt=\"deleteItem\">".replace("numberOfItem", numberOfItem) + "<input id=\"r\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"setupConnection(this.id)\" name=\"radioButton\">".replace("r", "radioButton" + numberOfItem) + "<input id=\"c\" class=\"radioAndCheckbox\" type=\"checkbox\">".replace("c", "checkbox" + numberOfItem);
    document.getElementById("checkbox" + numberOfItem).style.visibility = "hidden";
}


function drawArrowBetweenItems(mapOfItems, radioButton, checkbox) {
    ctx.beginPath();
    ctx.moveTo(mapOfItems.get(radioButton).xPos, mapOfItems.get(radioButton).yPos);
    ctx.lineTo(mapOfItems.get(checkbox).xPos, mapOfItems.get(checkbox).yPos);
    ctx.stroke();
}