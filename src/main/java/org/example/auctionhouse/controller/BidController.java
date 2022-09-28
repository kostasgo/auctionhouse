package org.example.auctionhouse.controller;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.Bid;
import org.example.auctionhouse.model.Bidder;
import org.example.auctionhouse.model.User;
import org.example.auctionhouse.payload.request.BidRequest;
import org.example.auctionhouse.service.AuctionService;
import org.example.auctionhouse.service.BidService;
import org.example.auctionhouse.service.BidderService;
import org.example.auctionhouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/v1/bids")
@RestController
public class BidController {

    @Autowired
    private BidService bidService;

    @Autowired
    private UserService userService;

    @Autowired
    private BidderService bidderService;

    @Autowired
    private AuctionService auctionService;

    @PostMapping("/add_bid")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> addBid(@Valid @RequestBody BidRequest bidRequest){


        User user = userService.findByUsername(bidRequest.getUsername()).get();

        Bidder bidder = user.getBidder();
        if (bidder == null) {
            bidder = new Bidder(user);
            user.setBidder(bidder);
            userService.saveOrUpdate(user);
        }

        Auction auction = auctionService.findById(bidRequest.getAuction_id());

        Bid bid = new Bid(bidder, auction, LocalDateTime.now(), bidRequest.getAmount());
        Set<Bid> bidders_bids = bidder.getBids();
        bidders_bids.add(bid);
        bidder.setBids(bidders_bids);
        bidderService.saveOrUpdate(bidder);
        bidService.saveOrUpdate(bid);

        Set<Bid> bids = auction.getBids();
        if (bids == null) {
            bids = new HashSet<Bid>();
        }

        bids.add(bid);
        auction.setBids(bids);

        auction.setCurrently(bidRequest.getAmount());
        Integer numberOfBids = auction.getNumberOfBids();
        numberOfBids++;
        auction.setNumberOfBids(numberOfBids);
        auctionService.saveOrUpdate(auction);

        return ResponseEntity.ok(bid);
    }
}
