function sendGraphToBackend() {
    var resultingMap = new Map();

    if (typeOfGraph == "none") {
        alert("Graph needs at least one edge");
        return;
    }

    var URL = "http://localhost:8080/"
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

        for (var i = 0; i < Object.entries(xhr.response).length; i++) {
            resultingMap.set(i, new NewNode(i, xhr.response[i].xpos, xhr.response[i].ypos));
            resultingMap.get(i).connectTo(xhr.response[i].arrayOfConnections, xhr.response[i].arrayOfWeights);
        }

        clearListOfNodes();

        if (typeOfGraph == "connect") {
            drawConnections(resultingMap, document.getElementById("colour").value, 2);
        }
        if (typeOfGraph == "directed") {
            drawDirectedConnections(resultingMap, document.getElementById("colour").value, 2);
        }

        for (i = 0; i < mapOfNodes.size; i++) {
            drawOneNodeOnTheCanvas(i, resultingMap.get(i).xPos, resultingMap.get(i).yPos, document.getElementById("colour").value);
        }
    }
}