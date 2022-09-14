package org.example.auctionhouse.repository;

import org.example.auctionhouse.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query("FROM Role WHERE name=:name")
    Role findByName(@Param("name") String name);
}