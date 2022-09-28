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

    public List<Auction> findAllActiveAuctions(Boolean active) {
        return auctionRepository.findAllActiveAuctions(active);
    }

    public List<Auction> searchAuctions(String search,Integer max,String category,String country,Boolean active, Integer id,Integer offset) {
        offset*=3;
        return auctionRepository.searchAuctions(search,max,category,country,active, id, offset);
    }

    public Integer searchAuctionsCount(String search,Integer max,String category,String country,Boolean active, Integer id) {
        return auctionRepository.searchAuctionsCount(search,max,category,country,active, id);
    }

    public List<Auction> findAllUserAuctions(Integer id ,Integer offset) {
        offset*=3;
        return auctionRepository.findAllUserAuctions(id, offset);
    }

    public Integer findAllUserAuctionsCount(Integer id) {
        return auctionRepository.findAllUserAuctionsCount(id);
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
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

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
