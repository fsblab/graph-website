package com.example.Graph;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/")
public class GraphController {
    private final MongoTemplate mongoTemplate;
    private int dbCounter;

    public GraphController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        this.dbCounter = -1;
    }

    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView loadSite() {
        return new ModelAndView("index.html");
    }


    @RequestMapping(value = "/sp/{from}/{to}",
                    method = RequestMethod.POST,
                    consumes = {"application/json"},
                    produces = {"application/json"})
    @ResponseBody
    public HashMap<Integer, NewNode> sp(@RequestBody HashMap<Integer, NewNode> mapOfNodes, @PathVariable("from") int from, @PathVariable("to") int to) {
        ArrayList<Integer> buffer = new ArrayList<>();
        ArrayList<Integer> Q = new ArrayList<>();
        ArrayList<Integer> neighbouringNodes = new ArrayList<>();
        ArrayList<ArrayList<Integer>> shortestPaths = new ArrayList<>();
        int currentNode = from;
        int oldSum, newSum;

        boolean somethingWentWrong = false;

        HashMap<Integer, NewNode> resultingMap = new HashMap<>();

        mapOfNodes.forEach((key, value) -> {Q.add(key);});
        mapOfNodes.forEach((key, value) -> {shortestPaths.add(new ArrayList<>(List.of(from)));});
        neighbouringNodes.addAll(mapOfNodes.get(from).getArrayOfConnections());
        buffer.addAll(mapOfNodes.get(from).getArrayOfConnections());

        while (!Q.isEmpty()) {
            for (int i : neighbouringNodes) {
                oldSum = 0;
                newSum = 0;

                if (shortestPaths.get(i).size() > 1) {
                    for (int j = 0; j < shortestPaths.get(i).size() - 1; j++) {
                        oldSum += mapOfNodes.get(shortestPaths.get(i).get(j)).getArrayOfWeights().get(mapOfNodes.get(shortestPaths.get(i).get(j)).getArrayOfConnections().indexOf(shortestPaths.get(i).get(j + 1)));
                    }
                } else {
                    oldSum = Integer.MAX_VALUE;
                }

                for (int j = 0; j < shortestPaths.get(currentNode).size() - 1; j++) {
                    newSum += mapOfNodes.get(shortestPaths.get(currentNode).get(j)).getArrayOfWeights().get(mapOfNodes.get(shortestPaths.get(currentNode).get(j)).getArrayOfConnections().indexOf(shortestPaths.get(currentNode).get(j + 1)));
                }

                //add the weight from 'currentNode' to 'i' to the sum
                try {
                    newSum += mapOfNodes.get(currentNode).getArrayOfWeights().get(mapOfNodes.get(currentNode).getArrayOfConnections().indexOf(i));
                } catch (Exception e) {
                    System.out.println("CurrentNode: " + currentNode + ", i: " + i);
                    System.out.println(e);
                    newSum = Integer.MAX_VALUE;
                }

                //if the new connection has a lower total weight, that's the new
                if (newSum < oldSum) {
                    //shortestPaths.get(i).forEach((x) -> {shortestPaths.get(i).remove(x);});
                    shortestPaths.get(i).clear();
                    shortestPaths.get(i).addAll(shortestPaths.get(currentNode));
                    shortestPaths.get(i).add(i);
                }
            }

            Q.remove((Integer) currentNode);

            for (int i : buffer) {
                if (Q.contains(i)) {
                    currentNode = i;
                    somethingWentWrong = false;
                    break;
                } else {
                    somethingWentWrong = true;
                }
            }

            if (somethingWentWrong) {
                break;
            }

            buffer.addAll(mapOfNodes.get(currentNode).getArrayOfConnections());
            buffer = new ArrayList<>(buffer.stream().distinct().collect(Collectors.toList()));

            neighbouringNodes = new ArrayList<>(mapOfNodes.get(currentNode).getArrayOfConnections());
        }

        int node;
        for (int i = 0; i < shortestPaths.get(to).size() - 1; i++) {
            node = shortestPaths.get(to).get(i);
            resultingMap.put(node, new NewNode(node, mapOfNodes.get(node).getXPos(), mapOfNodes.get(node).getYPos()));
            resultingMap.get(node).connectTo(new ArrayList<>(List.of(shortestPaths.get(to).get(i + 1))), new ArrayList<>(List.of(mapOfNodes.get(node).getArrayOfWeights().get(mapOfNodes.get(node).getArrayOfConnections().indexOf(shortestPaths.get(to).get(i + 1))))));
        }

        resultingMap.put(to, new NewNode(to, mapOfNodes.get(to).getXPos(), mapOfNodes.get(to).getYPos()));

        return resultingMap;
    }


    @RequestMapping(value = "/tsp",
                    method = RequestMethod.POST,
                    consumes = {"application/json"},
                    produces = {"application/json"})
    @ResponseBody
    public HashMap<Integer, NewNode> tsp(@RequestBody HashMap<Integer, NewNode> mapOfNodes) {
        return mapOfNodes;
    }


    @RequestMapping(value = "/mst",
                    method = RequestMethod.POST,
                    consumes = {"application/json"},
                    produces = {"application/json"})
    @ResponseBody
    public HashMap<Integer, NewNode> mst(@RequestBody HashMap<Integer, NewNode> mapOfNodes) {
        int minWeight, maxWeight, index;
        HashMap<Integer, NewNode> resultingMap = new HashMap<>();
        ArrayList<Integer> val;
        ArrayList<Integer> weight;

        maxWeight = 0;
        minWeight = 0;

        for (int i = 0; i < mapOfNodes.size(); i++) {
            val = new ArrayList<>();
            weight = new ArrayList<>();

            try {
                minWeight = Collections.min(mapOfNodes.get(i).getArrayOfWeights());
            } catch (Exception e) {
                System.out.println(e);
            }
            resultingMap.put(i, new NewNode(i, mapOfNodes.get(i).getXPos(), mapOfNodes.get(i).getYPos()));

            if (minWeight > maxWeight) {
                maxWeight = minWeight;
            }

            val.add(mapOfNodes.get(i).getArrayOfConnections().get(mapOfNodes.get(i).getArrayOfWeights().indexOf(minWeight)));
            weight.add(minWeight);

            resultingMap.get(i).connectTo(val, weight);

            try {
                if ((index = mapOfNodes.get(val.get(0)).getArrayOfWeights().indexOf(minWeight)) > -1)
                mapOfNodes.get(val.get(0)).getArrayOfWeights().remove(index);
            } catch (Exception e) {
                System.out.println(e);
            }

        }

        return resultingMap;
    }


    @RequestMapping(value = "/getdb/{id}",
                    method = RequestMethod.GET,
                    consumes = {"application/json"},
                    produces = {"application/json"})
    public GraphModel findById(@PathVariable long id) {
        return mongoTemplate.findById(id, GraphModel.class);
    }


    @RequestMapping(value = "/setdb/{type}",
                    method = RequestMethod.POST,
                    consumes = {"application/json"},
                    produces = {"application/json"})
    public GraphModel add(@PathVariable int type, @RequestBody HashMap<Integer, NewNode> graph) {
        dbCounter++;
        return mongoTemplate.save(new GraphModel(dbCounter, type, graph));
    }
}