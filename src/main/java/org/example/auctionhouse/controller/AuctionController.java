package org.example.auctionhouse.controller;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @GetMapping
    ResponseEntity<Collection<Auction>> findAll(){
        return new ResponseEntity<>(auctionService.findAll(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    ResponseEntity<Auction> findById(@PathVariable Long id){
        return new ResponseEntity<>(auctionService.findById(id), HttpStatus.OK);
    }

}
