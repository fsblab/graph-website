let canvas, ctx;
var typeOfGraph;
var newNodeIsSettable;
var setNodesButton, connectNodesButton, deleteConnectionsButton;
var mapOfNodes;
var radioButtonsVisibility, checkboxesVisibility;
var numberOfRadioButtonSelected;
var arrayOfCheckboxesSelected, arrayOfWeights;
var weightOfConnectionInput;

//some properties concerning every circle
const radius = 16;
var numberOfNode;
var xPosition, yPosition;


function init () {
    canvas = document.getElementById("pinBoard");
    ctx = canvas.getContext("2d");
    newNodeIsSettable = false;

    connectNodesButton = document.getElementById("connectButton");
    connectNodesButton.style.visibility = "hidden";

    directedConnectNodesBNutton = document.getElementById("directedConnectButton");
    directedConnectNodesBNutton.style.visibility = "hidden";

    deleteConnectionsButton = document.getElementById("deleteConnectionsButton");
    deleteConnectionsButton.style.visibility = "hidden";

    numberOfRadioButtonSelected = -1;
    numberOfNode = 0;
    arrayOfCheckboxesSelected = [];
    arrayOfWeights = [];

    typeOfGraph = "none";
    
    mapOfNodes = new Map();


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
    newNodeIsSettable = false;
}


function setCursorToCrosshair() {
    document.body.style.cursor = "crosshair";
    newNodeIsSettable = true;
}


function setNewNode(e) {
    var rect = canvas.getBoundingClientRect();
    xPosition = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    yPosition = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

    if (newNodeIsSettable) {
        drawOneNodeOnTheCanvas(numberOfNode, xPosition, yPosition);

        mapOfNodes.set(numberOfNode, new NewNode(numberOfNode, xPosition, yPosition));
        numberOfNode++;
    }
}


function uncheckRadioAndCheckboxes() {
    for (i = 0; i < numberOfNode; i++) {
        document.getElementById("checkbox" + i).style.visibility = "hidden";
        document.getElementById("checkbox" + i).checked = false;
        document.getElementById("radioButton" + i).style.visibility = "visible";
        document.getElementById("weightOfConnection" + i).style.visibility = "hidden";
    }

    connectNodesButton.style.visibility = "hidden";
    directedConnectNodesBNutton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";
}


function setupConnection(selectedID) {
    for (i = 0; i < numberOfNode; i++) {
        if (i == parseInt(selectedID.replace("radioButton", ""))) {
            numberOfRadioButtonSelected = i;
            continue;
        }

        document.getElementById("radioButton" + i).style.visibility = "hidden";
        document.getElementById("checkbox" + i).style.visibility = "visible";
        document.getElementById("weightOfConnection" + i).style.visibility = "visible";
    }

    for (i = 0; i < mapOfNodes.size; i++) {
        document.getElementById("weightOfConnection" + i).value = 0;
    }

    if (mapOfNodes.get(numberOfRadioButtonSelected).arrayOfWeights.length > 0)  {
        for (i = 0; i < mapOfNodes.get(numberOfRadioButtonSelected).arrayOfWeights.length; i++) {
            num = mapOfNodes.get(numberOfRadioButtonSelected).arrayOfConnections[i];
            document.getElementById("weightOfConnection" + num).value = mapOfNodes.get(numberOfRadioButtonSelected).arrayOfWeights[i];
            document.getElementById("checkbox" + num).checked = true;
        }
    }

    if (typeOfGraph == "none") {
        connectNodesButton.style.visibility = "visible";
        directedConnectNodesBNutton.style.visibility = "visible";
        deleteConnectionsButton.style.visibility = "visible";
    }
    else if (typeOfGraph == "connect") {
        connectNodesButton.style.visibility = "visible";
        directedConnectNodesBNutton.style.visibility = "hidden";
        deleteConnectionsButton.style.visibility = "visible";
    }
    else {
        connectNodesButton.style.visibility = "hidden";
        directedConnectNodesBNutton.style.visibility = "visible";
        deleteConnectionsButton.style.visibility = "visible";
    }
}


function setConnection(selectedButton) {
    if (selectedButton == "connectButton") {
        typeOfGraph = "connect";
    }
    else {
        typeOfGraph = "directed";
    }
    
    for (i = 0; i < numberOfNode; i++) {
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

    connectNodesButton.style.visibility = "hidden";
    directedConnectNodesBNutton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";

    if (typeOfGraph == "connect") {
        mapOfNodes.get(numberOfRadioButtonSelected).connectTo(arrayOfCheckboxesSelected, arrayOfWeights);

        for (i = 0; i < mapOfNodes.get(numberOfRadioButtonSelected).arrayOfConnections.length; i++) {
            mapOfNodes.get(mapOfNodes.get(numberOfRadioButtonSelected).arrayOfConnections[i]).connectTo([numberOfRadioButtonSelected], [mapOfNodes.get(numberOfRadioButtonSelected).arrayOfWeights[i]])
        }
    }
    else if (typeOfGraph == "directed") {
        mapOfNodes.get(numberOfRadioButtonSelected).connectTo(arrayOfCheckboxesSelected, arrayOfWeights);
    }

    numberOfRadioButtonSelected = -1;
    arrayOfCheckboxesSelected = [];
    arrayOfWeights = [];

    redrawCanvas();
}


function deleteConnectionOfSelectedNode() {
    mapOfNodes.get(numberOfRadioButtonSelected).connectTo([], []);

    if (typeOfGraph == "connect") {
        for (i = 0; i < mapOfNodes.size; i++) {
            for (j = 0; j < mapOfNodes.get(i).arrayOfConnections.length; j++) {
                if (mapOfNodes.get(i).arrayOfConnections[j] == numberOfRadioButtonSelected) {
                    mapOfNodes.get(i).arrayOfConnections.splice(j, 1);
                    mapOfNodes.get(i).arrayOfWeights.splice(j, 1);
                }
            }
        }
    }

    for (i = 0; i < numberOfNode; i++) {
        document.getElementById("checkbox" + i).style.visibility = "hidden";
        document.getElementById("radioButton" + i).style.visibility = "visible";
        document.getElementById("radioButton" + i).checked = false;
        document.getElementById("weightOfConnection" + i).style.visibility = "hidden";
    }

    connectNodesButton.style.visibility = "hidden";
    directedConnectNodesBNutton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";

    redrawCanvas();
}


function clearEverything() {
    clearListOfNodes();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    numberOfNode = 0;

    /* why the fuck does this not work?
    for (i = 0; i < mapOfNodes.size; i++) {
        mapOfNodes.delete(i);
    }*/

    for (i = mapOfNodes.size - 1; i >= 0; i--) {
        mapOfNodes.delete(i);
    }

    connectNodesButton.style.visibility = "hidden";
    directedConnectNodesBNutton.style.visibility = "hidden";
    deleteConnectionsButton.style.visibility = "hidden";

    typeOfGraph = "none";
}


function deleteNode(selectedId) {
    clearListOfNodes();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = parseInt(selectedId); i < mapOfNodes.size; i++) {
        mapOfNodes.delete(i);
        mapOfNodes.set(i, mapOfNodes.get(i + 1));
    }

    mapOfNodes.delete(mapOfNodes.size - 1);
    numberOfNode--;

    for (i = 0; i < mapOfNodes.size; i++) {
        if (mapOfNodes.get(i).arrayOfConnections.length > 0) {
            for (j = 0; j < mapOfNodes.get(i).arrayOfConnections.length; j++) {
                
                if (mapOfNodes.get(i).arrayOfConnections[j] == selectedId) {
                    mapOfNodes.get(i).arrayOfConnections.splice(j, 1);
                    mapOfNodes.get(i).arrayOfWeights.splice(j, 1);
                    if (j < mapOfNodes.get(i).arrayOfConnections.length) {
                        mapOfNodes.get(i).arrayOfConnections[j]--;
                    }
                }
                else if (mapOfNodes.get(i).arrayOfConnections[j] > selectedId) {
                    mapOfNodes.get(i).arrayOfConnections[j]--;
                }

            }
        }
    }

    redrawCanvas();
}


document.addEventListener('DOMContentLoaded', init);