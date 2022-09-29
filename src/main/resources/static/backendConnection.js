var test;

function sendGraphToBackend() {
    var resultingMap = new Map();

    var from = document.getElementById("fromNode").value;
    var to = document.getElementById("toNode").value;

    if (typeOfGraph == "none") {
        alert("Graph needs at least one edge");
        return;
    }

    var URL = "http://localhost:8080/";
    // create XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    // open a POST request
    if (document.getElementById("listOfComputations").value == "sp") {
        if (parseInt(from) > numberOfNode) {
            alert("FROM parameter to large");
            return;
        }
    
        if (parseInt(to) > numberOfNode) {
            alert("TO parameter too large");
            return;
        }

        if (parseInt(from) < 0 || parseInt(to) < 0) {
            alert("FROM or TO are parameter not allowed to be below 0");
            return;
        }

        xhr.open("POST", URL + "sp" + "/" + from + "/" + to);
    } else if (document.getElementById("listOfComputations").value == "tsp") {
        xhr.open("POST", URL + "tsp");
    } else if (document.getElementById("listOfComputations").value == "mst") {
        if (typeOfGraph == "directed") {
            return;
        }
        xhr.open("POST", URL + "mst");
    }

    // set content-type header to JSON
    xhr.setRequestHeader("Content-Type", "application/json");

    // send JSON data to the remote server
    xhr.send(JSON.stringify(Object.fromEntries(mapOfNodes)));

    // triggered when the response is fully received
    xhr.onload = function() {
        console.log(xhr.status);

        if(xhr.status != 200) {
            alert("An Error occured: HTTP Statuscode " + xhr.status.toString());
            return;
        }

        for (var i = 0; i < numberOfNode; i++) {
            try {
                resultingMap.set(i, new NewNode(i, xhr.response[i].xpos, xhr.response[i].ypos));
                resultingMap.get(i).connectTo(xhr.response[i].arrayOfConnections, xhr.response[i].arrayOfWeights);
            } catch (error) {
                console.error(error);
            }
        }

        if (resultingMap.size == 0) {
            alert("No solution could be calculated");
            return;
        }

        if (typeOfGraph == "connect") {
            drawConnections(resultingMap, document.getElementById("colour").value, 2);
        }
        if (typeOfGraph == "directed") {
            drawDirectedConnections(resultingMap, document.getElementById("colour").value, 2);
        }

        for (var i = 0; i < resultingMap.size; i++) {
            if (resultingMap.has (i)) {
                try {
                    drawOneNodeOnTheCanvas(i, resultingMap.get(i).xPos, resultingMap.get(i).yPos, document.getElementById("colour").value);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        clearListOfNodes();

        for (i = 0; i < numberOfNode; i++) {
            document.getElementById("listOfNodes").innerHTML += "<br>" + i + "&emsp;" + "<input id=numberOfNode class=\"deleteButton\" onclick=\"deleteNode(this.id)\" type=\"image\" src=\"assets/del.png\">".replace("numberOfNode", i) + "<input id=\"w\" type=\"text\" class=\"textInput\" value=\"0\">".replace("w", "weightOfConnection" + i) + "<input id=\"c\" class=\"radioAndCheckbox\" type=\"checkbox\">".replace("c", "checkbox" + i) + "<input id=\"r\" class=\"radioAndCheckbox\" type=\"radio\" onclick=\"setupConnection(this.id)\" name=\"radioButton\">".replace("r", "radioButton" + i);
            document.getElementById("checkbox" + i).style.visibility = "hidden";
            document.getElementById("weightOfConnection" + i).style.visibility = "hidden";
        }
    }
}


function setdb() {
    var type;

    if (typeOfGraph == "connect") {
        type = 0;
    } else {
        type = 1;
    }

    var URL = "http://localhost:8080/";

    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", URL + "setdb" + "/" + type);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(Object.fromEntries(mapOfNodes)));

    xhr.onload = function() {
        console.log(xhr.status);
    }
}


function getdb() {
    var resultingMap = new Map();
    var id = document.getElementById("dbid").value;

    var URL = "http://localhost:8080/";

    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", URL + "getdb" + "/" + id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(id));

    xhr.onload = function() {
        console.log(xhr.status);

        if(xhr.status != 200) {
            alert("An Error occured: HTTP Statuscode " + xhr.status.toString());
            return;
        }

        if (xhr.response.typeOfGraph == 0) {
            typeOfGraph = "connect";
        } else {
            typeOfGraph = "directed";
        }

        for (var i = 0; i < Object.keys(xhr.response.mapOfNodes).length; i++) {
            try {
                resultingMap.set(i, new NewNode(i, parseInt(xhr.response.mapOfNodes[i].xpos), parseInt(xhr.response.mapOfNodes[i].ypos)));
                resultingMap.get(i).connectTo(xhr.response.mapOfNodes[i].arrayOfConnections, xhr.response.mapOfNodes[i].arrayOfWeights);
            } catch (error) {
                console.error(error);
            }
        }

        redrawCanvas(resultingMap);

        mapOfNodes = resultingMap;
    }
}