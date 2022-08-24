class NewNode {
    constructor(idOfNodes, xPos, yPos) {
        this.idOfNodes = idOfNodes;
        this.xPos = xPos;
        this.yPos = yPos;
        this.arrayOfConnections = [];
        this.arrayOfWeights = [];
    }

    connectTo(nodes, weights) {
        if (nodes.length == weights.length) {
            this.arrayOfConnections = nodes;
            this.arrayOfWeights = weights;
        }
    }
}