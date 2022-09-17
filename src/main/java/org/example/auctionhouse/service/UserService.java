package org.example.auctionhouse.service;

import java.util.Collection;
import java.util.Optional;

import org.example.auctionhouse.model.User;
import org.example.auctionhouse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service("userService")
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public Collection<User> findAll() {
        return userRepository.findAll();
    }


    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }


    public User saveOrUpdate(User user) {
        return userRepository.saveAndFlush(user);
    }



}