package org.example.auctionhouse.controller;

import org.example.auctionhouse.model.Message;
import org.example.auctionhouse.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1/messages")
@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;

    @GetMapping
    ResponseEntity<Collection<Message>> findAll(){
        return new ResponseEntity<>(messageService.findAll(), HttpStatus.OK);
    }

    @PostMapping(params={"id", "inbox"})
    ResponseEntity<Collection<Message>> findInbox(@Param("id")Integer id){
        return new ResponseEntity<>(messageService.getUserInbox(id), HttpStatus.OK);
    }

    @PostMapping(params={"id", "sent"})
    ResponseEntity<Collection<Message>> findSent(@Param("id")Integer id){
        return new ResponseEntity<>(messageService.getUserSent(id), HttpStatus.OK);
    }


}
