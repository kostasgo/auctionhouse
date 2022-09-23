package org.example.auctionhouse.controller;

import org.example.auctionhouse.model.User;
import org.example.auctionhouse.payload.request.EnableUserRequest;
import org.example.auctionhouse.payload.response.MessageResponse;
import org.example.auctionhouse.repository.UserRepository;
import org.example.auctionhouse.service.AuctionService;
import org.example.auctionhouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/enable")
    public ResponseEntity<?> enableUser(@Valid @RequestBody EnableUserRequest enableRequest){
        if (!userRepository.existsByUsername(enableRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User does not exist!"));
        }

        User user = userService.findByUsername(enableRequest.getUsername()).get();

        user.setEnabled(true);
        userService.saveOrUpdate(user);

        return ResponseEntity.ok(new MessageResponse("User enabled successfully!"));
    }
}
