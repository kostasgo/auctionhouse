package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Seller;
import org.example.auctionhouse.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SellerService {

    @Autowired
    private SellerRepository sellerRepository;

    public Seller saveOrUpdate(Seller seller) {
        return sellerRepository.saveAndFlush(seller);
    }

}