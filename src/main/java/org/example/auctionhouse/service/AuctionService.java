package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.Bid;
import org.example.auctionhouse.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;
import java.util.Set;

@Service
public class AuctionService {

    @Autowired
    private AuctionRepository auctionRepository;

    public List<Auction> findAll() {
        return auctionRepository.findAll();
    }

    public List<Auction> findActive(Boolean active, Integer id) {
        return auctionRepository.findAllActiveAuctions(active, id);
    }

    public List<Auction> findUserAuctions(Integer id) {
        return auctionRepository.findUserAuctions(id);
    }

    public Auction findById(Long id) {
        return auctionRepository.findById(id).get();
    }

    public Auction saveOrUpdate(Auction auction) {
        return auctionRepository.saveAndFlush(auction);
    }

    public void addBidToAuction(Auction auction, Bid bid){
        Set<Bid>  bids = auction.getBids();
        bids.add(bid);

        auction.setBids(bids);

        this.saveOrUpdate(auction);
    }


}
