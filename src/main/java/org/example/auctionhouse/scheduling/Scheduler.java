package org.example.auctionhouse.scheduling;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Scheduler {

    @Autowired
    private AuctionService auctionService;

    //@Scheduled(fixedRate = 1000)
    public void manageAuctionsExpiration(){
        List<Auction> auctions = auctionService.findAllActiveAuctions(true);
        for(Auction auction : auctions) {
            auctionService.checkIfCompleted(auction);
        }
    }
}
