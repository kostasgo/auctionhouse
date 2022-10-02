package org.example.auctionhouse.scheduling;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.User;
import org.example.auctionhouse.parsing.XMLParse;
import org.example.auctionhouse.recommendations.MatrixFactorization;
import org.example.auctionhouse.repository.UserRepository;
import org.example.auctionhouse.service.AuctionService;
import org.example.auctionhouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Scheduler {

    @Autowired
    private AuctionService auctionService;
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

//    @Bean
//    public Integer numOfFeatures(){
//        return 10;
//    }

    @Scheduled(fixedRate = 2000)
    public void manageAuctionsExpiration(){
        List<Auction> auctions = auctionService.findAllActiveAuctions(true);
        for(Auction auction : auctions) {
            auctionService.checkIfCompleted(auction);
        }
    }

    @Scheduled(cron = "@midnight")
    public void trainRecommendations(){
        List<Auction> allAuctions = auctionService.findAll();
        List<User> allUsers = userRepository.findAll();
        Double[][] recommendationArray = auctionService.createRecommendationArray(allAuctions, allUsers);
        MatrixFactorization clf = new MatrixFactorization(auctionService, userService, 10, recommendationArray);
    }
}
