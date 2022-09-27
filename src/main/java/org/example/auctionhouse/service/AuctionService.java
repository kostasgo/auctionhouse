package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.Bid;
import org.example.auctionhouse.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Service
public class AuctionService {

    @Autowired
    private AuctionRepository auctionRepository;

    public List<Auction> findAll() {
        return auctionRepository.findAll();
    }

    public List<Auction> findAllActive() {
        return auctionRepository.findAllActiveAuctions();
    }

    public List<Auction> findActive(Boolean active, Integer id) {
        return auctionRepository.findActiveAuctions(active, id);
    }

    public List<Auction> searchActive(String search,Boolean active, Integer id) {
        return auctionRepository.searchActiveAuctions(search,active, id);
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

    public Boolean checkIfCompleted(Auction auction){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        LocalDateTime ends = auction.getEnds();
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(ends)){
            auction.setActive(false);
            auction.setCompleted(true);

            this.saveOrUpdate(auction);
            System.out.print(formatter.format(now)+": Auction "+ auction.getId() +": CHANGED\n");
            return true;
        }
        System.out.print(formatter.format(now)+": Auction "+ auction.getId() +": NOT YET\n");
        return false;

    }


}
