package org.example.auctionhouse.repository;

import org.example.auctionhouse.enums.RoleTypes;
import org.example.auctionhouse.model.Category;
import org.example.auctionhouse.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}
