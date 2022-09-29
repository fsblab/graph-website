package com.example.Graph;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;

@Data
@Document("graph")
public class GraphModel {
    @Id
    private long graphID;
    private int typeOfGraph;
    private HashMap<Integer, NewNode> mapOfNodes;

    GraphModel(long graphID, int typeOfGraph, HashMap<Integer, NewNode> mapOfNodes) {
        this.graphID = graphID;
        this.typeOfGraph = typeOfGraph;
        this.mapOfNodes = mapOfNodes;
    }
}