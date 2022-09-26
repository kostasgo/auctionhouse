package org.example.auctionhouse.controller;

import org.example.auctionhouse.model.Category;
import org.example.auctionhouse.model.Message;
import org.example.auctionhouse.service.CategoryService;
import org.example.auctionhouse.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1/categories")
@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping
    ResponseEntity<Collection<Message>> findAll(){
        return new ResponseEntity<>(messageService.findAll(), HttpStatus.OK);
    }
}
