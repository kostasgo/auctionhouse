package org.example.auctionhouse.controller;

import com.fasterxml.jackson.core.JsonEncoding;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.example.auctionhouse.model.Message;
import org.example.auctionhouse.model.User;
import org.example.auctionhouse.payload.response.MessageResponse;
import org.example.auctionhouse.service.MessageService;
import org.example.auctionhouse.service.UserService;
import org.hibernate.type.LocalDateTimeType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1/messages")
@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

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

    @PostMapping("/delete")
    ResponseEntity<?> deleteMessage(@Param("id")Integer id){
        messageService.deleteMessage(id);
        return ResponseEntity.ok(id);
    }

    @PostMapping("/new")
    ResponseEntity<?> sendMessage(@Param("senderId")Long senderId, @Param("receiverId")Long receiverId, @Param("text")String text){

        User sender = userService.findById(senderId).get();
        User receiver = userService.findById(receiverId).get();
        Message message = new Message(text , sender, receiver);
        message.setTime(LocalDateTime.now());
        messageService.saveOrUpdate(message);

        Set<Message> sent = sender.getSent();
        Set<Message> received = receiver.getReceived();

        sent.add(message);
        received.add(message);

        sender.setSent(sent);
        receiver.setReceived(received);

        receiver.setNotify(true);
        userService.saveOrUpdate(receiver);
        userService.saveOrUpdate(sender);

        return ResponseEntity.ok(null);
    }

    @GetMapping("/username")
    ResponseEntity<?> getUsername(@Param("id")Long id) throws JSONException {
        User receiver = userService.findById(id).get();
        return ResponseEntity.ok(new MessageResponse(receiver.getUsername()));
    }

}
