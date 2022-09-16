package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Bid;
import org.example.auctionhouse.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    public Bid saveOrUpdate(Bid bid) {
        return bidRepository.saveAndFlush(bid);
    }

}