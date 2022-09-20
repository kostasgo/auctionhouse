package org.example.auctionhouse.controller;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;


@RequestMapping("/api/v1/auctions")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
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
