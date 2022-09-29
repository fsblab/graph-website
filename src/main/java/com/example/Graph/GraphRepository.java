package com.example.Graph;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface GraphRepository extends MongoRepository<GraphModel, Integer> {
    @Query(value="{graphID= '?0'}")
    GraphModel findById(long id);
}