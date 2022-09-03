class NewNode {
    constructor(idOfNode, xPos, yPos) {
        this.idOfNode = idOfNode;
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