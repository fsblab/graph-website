function drawOneNodeOnTheCanvas(numberOfNode, xPos, yPos, colour) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(numberOfNode.toString(), xPos, yPos + 6);
    
    document.getElementById("listOfNodes").innerHTML += "<br>" + numberOfNode + "&emsp;" + "<input id=numberOfNode class=\"deleteButton\" onclick=\"deleteNode(this.id)\" type=\"image\" src=\"assets/del.png\">".replace("numberOfNode", numberOfNode) + "<input id=\"w\" type=\"text\" class=\"textInput\" value=\"0\">".replace("w", "weightOfConnection" + numberOfNode) + "<input id=\"c\" class=\"radioAndCheckbox\" type=\"checkbox\">".replace("c", "checkbox" + numberOfNode) + "<input id=\"r\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"setupConnection(this.id)\" name=\"radioButton\">".replace("r", "radioButton" + numberOfNode);
    document.getElementById("checkbox" + numberOfNode).style.visibility = "hidden";
    document.getElementById("weightOfConnection" + numberOfNode).style.visibility = "hidden";
}


function drawConnections(mapOfNodes, colour, lineWidth) {
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;
    ctx.lineWidth = lineWidth;

    for (i = 0; i < mapOfNodes.size; i++) {
        if (mapOfNodes.get(i).arrayOfConnections.length > 0) {
            for (j = 0; j < mapOfNodes.get(i).arrayOfConnections.length; j++) {
                tox = mapOfNodes.get(mapOfNodes.get(i).arrayOfConnections[j]).xPos;
                toy = mapOfNodes.get(mapOfNodes.get(i).arrayOfConnections[j]).yPos;

                ctx.beginPath();
                ctx.moveTo(mapOfNodes.get(i).xPos, mapOfNodes.get(i).yPos);
                ctx.lineTo(tox, toy);
                ctx.stroke();
            }
        }
    }
}


function drawDirectedConnections(mapOfNodes, colour, lineWidth) {
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;
    ctx.lineWidth = lineWidth;
    
    for (i = 0; i < mapOfNodes.size; i++) {
        if (mapOfNodes.get(i).arrayOfConnections.length > 0) {
            for (j = 0; j < mapOfNodes.get(i).arrayOfConnections.length; j++) {
                tox = mapOfNodes.get(mapOfNodes.get(i).arrayOfConnections[j]).xPos + determinePos(i, j, "x");
                toy = mapOfNodes.get(mapOfNodes.get(i).arrayOfConnections[j]).yPos + determinePos(i, j, "y");

                angle = Math.atan2(toy - mapOfNodes.get(i).yPos, tox - mapOfNodes.get(i).xPos);

                ctx.beginPath();
                ctx.moveTo(mapOfNodes.get(i).xPos, mapOfNodes.get(i).yPos);
                ctx.lineTo(tox, toy);
                ctx.stroke();

                ctx.lineTo(tox - radius * Math.cos(angle - Math.PI / 6), toy - radius * Math.sin(angle - Math.PI / 6));
                ctx.stroke();
                ctx.moveTo(tox, toy);
                ctx.lineTo(tox - radius * Math.cos(angle + Math.PI / 6), toy - radius * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
            }
        }
    }
}


function clearListOfNodes() {
    document.getElementById("listOfNodes").innerHTML = "<b>List of Nodes:</b><input id=\"unchechRadioAndCheckboxes\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"uncheckRadioAndCheckboxes()\" name=\"radioButton\"><br>";
}


function redrawCanvas(mapOfNodes) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearListOfNodes();

    if (typeOfGraph == "connect") {
        drawConnections(mapOfNodes, "black", 1);
    }
    if (typeOfGraph == "directed") {
        drawDirectedConnections(mapOfNodes, "black", 1);
    }

    for (i = 0; i < mapOfNodes.size; i++) {
        drawOneNodeOnTheCanvas(i, mapOfNodes.get(i).xPos, mapOfNodes.get(i).yPos, "black");
    }
}


function determinePos(outerIterator, innerIterator, xy) {
    var dx, dy, dxpos, dypos, angle;

    dx = mapOfNodes.get(outerIterator).xPos - mapOfNodes.get(mapOfNodes.get(outerIterator).arrayOfConnections[innerIterator]).xPos;
    dy = mapOfNodes.get(outerIterator).yPos - mapOfNodes.get(mapOfNodes.get(outerIterator).arrayOfConnections[innerIterator]).yPos;

    angle = Math.atan2(dy, dx);

    if (xy == "x") {
        dxpos = Math.cos(angle) * (radius);
        return dxpos;
    }
    else if (xy == "y") {
        dypos = Math.sin(angle) * (radius);
        return dypos;
    }
    else {
        return;
    }
}


function drawTestcase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearListOfNodes();

    var x, y, zeroNodeConnections;
    x = canvas.width / 2;
    y = canvas.height / 2;

    zeroNodeConnections = [];

    mapOfNodes.set(0, new NewNode(0, x, y));
    iterator = 1;

    for (i = 0; i <= 2 * Math.PI; i += Math.PI / 8) {
        mapOfNodes.set(iterator, new NewNode(iterator, x + (Math.cos(i) * (x / y) * 200), y + (Math.sin(i) * (x / y) * 200)));
        iterator++;
    }

    for (i = 0; i < mapOfNodes.size; i++) {
        drawOneNodeOnTheCanvas(i, mapOfNodes.get(i).xPos, mapOfNodes.get(i).yPos, "black");
    }

    document.getElementById("radioButton" + 0).checked = true;

    
    for (i = 1; i < mapOfNodes.size; i++) {
        document.getElementById("checkbox" + i).checked = true;
        zeroNodeConnections.push(i);
        mapOfNodes.get(i).connectTo([i + 1], [i]);
    }

    mapOfNodes.get(0).connectTo(zeroNodeConnections, zeroNodeConnections);
    mapOfNodes.get(16).connectTo([1], [0]);

    numberOfNode = iterator;

    typeOfGraph = "none";

    setupConnection("radioButton0");
}