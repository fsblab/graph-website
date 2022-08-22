class NewItem {
    constructor(idOfItem, xPos, yPos) {
        this.idOfItem = idOfItem;
        this.xPos = xPos;
        this.yPos = yPos;
    }

    connectTo(arrayOfItems, arrayOfweights) {
        if (arrayOfItems.length == arrayOfweights.legnth) {
            this.arrayOfConnections = arrayOfItems;
            this.arrayOfWeights = arrayOfweights;
        }
    }
}