package org.example.auctionhouse.service;

import org.example.auctionhouse.model.User;
import org.example.auctionhouse.web.dto.UserRegistrationDto;

public interface UserService {

    User save(UserRegistrationDto registrationDto);
}
