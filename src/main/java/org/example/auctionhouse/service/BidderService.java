package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Bidder;
import org.example.auctionhouse.repository.BidderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BidderService {

    @Autowired
    private BidderRepository bidderRepository;

    public Bidder saveOrUpdate(Bidder bidder) {
        return bidderRepository.saveAndFlush(bidder);
    }

}
