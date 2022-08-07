package org.example.auctionhouse.repository;

import org.example.auctionhouse.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
