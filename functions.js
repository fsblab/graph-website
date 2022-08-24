function drawOneNodeOnTheCanvas(numberOfNode, xPos, yPos) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(numberOfNode.toString(), xPos, yPos + 6);
    
    document.getElementById("listOfNodes").innerHTML += "<br>" + numberOfNode + "&emsp;" + "<input id=numberOfNode class=\"deleteButton\" onclick=\"deleteNode(this.id)\" type=\"image\" src=\"assets/del.png\">".replace("numberOfNode", numberOfNode) + "<input id=\"w\" type=\"text\" class=\"textInput\" value=\"0\">".replace("w", "weightOfConnection" + numberOfNode) + "<input id=\"c\" class=\"radioAndCheckbox\" type=\"checkbox\">".replace("c", "checkbox" + numberOfNode) + "<input id=\"r\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"setupConnection(this.id)\">".replace("r", "radioButton" + numberOfNode);
    document.getElementById("checkbox" + numberOfNode).style.visibility = "hidden";
    document.getElementById("weightOfConnection" + numberOfNode).style.visibility = "hidden";
}


function drawDirectedConnections(radioButton, checkbox) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mapOfNodes.get(radioButton).xPos, mapOfNodes.get(radioButton).yPos);
    ctx.lineTo(mapOfNodes.get(checkbox).xPos, mapOfNodes.get(checkbox).yPos);
    ctx.stroke();
}


function clearListOfNodes() {
    document.getElementById("listOfNodes").innerHTML = "<b>List of Nodes:</b><input id=\"unchechRadioAndCheckboxes\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"uncheckRadioAndCheckboxes()\" name=\"radioButton\"><br>";
}


function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearListOfNodes();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    for (i = 0; i < mapOfNodes.size; i++) {
        for (j = 0; j < mapOfNodes.get(i).arrayOfConnections.length; j++) {
            ctx.beginPath();
            ctx.moveTo(mapOfNodes.get(i).xPos, mapOfNodes.get(i).yPos);
            ctx.lineTo(mapOfNodes.get(mapOfNodes.get(i).arrayOfConnections[j]).xPos, mapOfNodes.get(mapOfNodes.get(i).arrayOfConnections[j]).yPos);
            ctx.stroke();
        }
    }


    for (i = 0; i < mapOfNodes.size; i++) {
        drawOneNodeOnTheCanvas(i, mapOfNodes.get(i).xPos, mapOfNodes.get(i).yPos);
    }
}


function drawTestcase() {
    mapOfNodes.set(0, new NewNode(0, 400, 400));
    mapOfNodes.set(1, new NewNode(1, 600, 400));
    mapOfNodes.set(2, new NewNode(2, 500, 300));
    mapOfNodes.set(3, new NewNode(3, 400, 200));
    mapOfNodes.set(4, new NewNode(4, 300, 300));
    mapOfNodes.set(5, new NewNode(5, 200, 400));
    mapOfNodes.set(6, new NewNode(6, 300, 500));
    mapOfNodes.set(7, new NewNode(7, 400, 600));
    mapOfNodes.set(8, new NewNode(8, 500, 500));

    for (i = 0; i < mapOfNodes.size; i++) {
        drawOneNodeOnTheCanvas(i, mapOfNodes.get(i).xPos, mapOfNodes.get(i).yPos);
        document.getElementById("checkbox" + i).checked = true;
    }

    document.getElementById("radioButton" + 0).checked = true;
    setupConnection(0);

    for (i = 0; i < mapOfNodes.size; i++) {
        document.getElementById("checkbox" + i).checked = true;
    }

    numberOfNode = 9;
}