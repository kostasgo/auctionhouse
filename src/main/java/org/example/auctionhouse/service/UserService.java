package org.example.auctionhouse.service;

import java.util.*;

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

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    public User saveOrUpdate(User user) {
        return userRepository.saveAndFlush(user);
    }

    public Double[][] getAllUserFeatures(List<User> users, Integer features){

        Double[][] allUserFeatures = new Double[users.size()][features];

        int i=0;
        for (User user : users){
            Double[] userFeatures = user.getUserFeatures();
            if(userFeatures == null){
                Random r = new Random();
                userFeatures= new Double[features];
                for (int j=0; j<features; j++){
                    userFeatures[j] = r.nextDouble();
                }
                user.setUserFeatures(userFeatures);
                this.saveOrUpdate(user);
            }
            allUserFeatures[i] = userFeatures;
            i++;
        }

        return allUserFeatures;
    }







}