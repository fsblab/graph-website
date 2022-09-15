package com.example.Graph;

import lombok.Data;

import java.util.ArrayList;



@Data
public class NewNode {
    private int idOfNode;
    private double xPos, yPos;
    private ArrayList<Integer> arrayOfConnections, arrayOfWeights;


    NewNode(int idOfNode, double xPos, double yPos) {
        this.idOfNode = idOfNode;
        this.xPos = xPos;
        this.yPos = yPos;
        this.arrayOfConnections = new ArrayList<>();
        this.arrayOfWeights = new ArrayList<>();
    }


    public void connectTo(ArrayList<Integer> nodes, ArrayList<Integer> weights) {
        if (nodes.size() == weights.size()) {
            this.arrayOfConnections = nodes;
            this.arrayOfWeights = weights;
        }
    }
}
