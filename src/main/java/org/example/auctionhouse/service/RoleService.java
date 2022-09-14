package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Role;
import org.example.auctionhouse.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class RoleService{

    @Autowired
    private RoleRepository roleRepository;

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    public Role findByName(String name) {
        return roleRepository.findByName(name);
    }

    public Role saveOrUpdate(Role role) {
        return roleRepository.saveAndFlush(role);
    }


}