class NewItem {
    constructor(idOfItem, xPos, yPos) {
        this.idOfItem = idOfItem;
        this.xPos = xPos;
        this.yPos = yPos;
        this.arrayOfConnections = [];
        this.arrayOfWeights = [];
    }

    connectTo(items, weights) {
        if (items.length == weights.length) {
            this.arrayOfConnections = items;
            this.arrayOfWeights = weights;
        }
    }
}