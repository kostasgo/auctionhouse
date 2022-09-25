package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.Category;
import org.example.auctionhouse.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category saveOrUpdate(Category category) {
        return categoryRepository.saveAndFlush(category);
    }

}