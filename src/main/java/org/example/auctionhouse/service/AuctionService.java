package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.Bid;
import org.example.auctionhouse.model.Message;
import org.example.auctionhouse.repository.AuctionRepository;
import org.example.auctionhouse.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    private MessageRepository messageRepository;

    public List<Auction> findAll() {
        return auctionRepository.findAll();
    }

    public List<Auction> findAllActiveAuctions(Boolean active) {
        return auctionRepository.findAllActiveAuctions(active);
    }

    public List<Auction> searchAuctions(String search,Boolean active, Integer id,Integer offset) {
        offset*=3;
        return auctionRepository.searchAuctions(search,active, id, offset);
    }

    public Integer searchAuctionsCount(String search,Boolean active, Integer id) {
        return auctionRepository.searchAuctionsCount(search,active, id);
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

    public Bid getHighestBidder(Auction auction){
        Set<Bid> allBids = auction.getBids();

        Double highestBid = auction.getFirstBid();
        Bid winner = new Bid();
        for(Bid bid : allBids){
            if (bid.getAmount() > highestBid){
                highestBid = bid.getAmount();
                winner = bid;
            }
        }

        return winner;
    }

    public Boolean checkIfCompleted(Auction auction){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime ends = auction.getEnds();
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(ends)){
            auction.setActive(false);
            auction.setCompleted(true);
            Long senderId, receiverId;
            String msg;

            receiverId = auction.getSeller().getUser().getId();

            if(auction.getNumberOfBids() > 0){
                Bid winner = this.getHighestBidder(auction);
                senderId = winner.getBidder().getUser().getId();
                msg = "Hello, I just won the auction " + auction.getId() + " (" + auction.getName() + ").\n" +
                        "You can contact me to arrange payment and delivery.\n" +
                        "Phone Number: "+winner.getBidder().getUser().getPhone()+"\n" +
                        "Email: "+winner.getBidder().getUser().getEmail();
            }
            else{
                senderId = Long.valueOf(1);
                msg ="Sadly, there were no bids in your Auction: "+ auction.getId() + " || (" + auction.getName() + ").\n" +
                        "Don't be disheartened! This happens even to the most experienced Auctioneers.\n" +
                        "Try to auction again, at a different price, or for a longer period of time";
            }

            Message message = new Message(msg, senderId, receiverId);
            messageRepository.saveAndFlush(message);

            this.saveOrUpdate(auction);
            return true;
        }
        return false;

    }


}
