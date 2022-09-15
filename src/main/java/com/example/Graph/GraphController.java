package com.example.Graph;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;


@RestController
@RequestMapping("/")
public class GraphController {

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
        ArrayList<Integer> Q = new ArrayList<>();
        mapOfNodes.forEach((key, value) -> {Q.add(key);});

        System.out.println("Rest call received");
        System.out.println(from);
        System.out.println(to);

        return mapOfNodes;
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
}