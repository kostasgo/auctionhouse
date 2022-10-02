package org.example.auctionhouse.service;

import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.Bid;
import org.example.auctionhouse.model.Message;
import org.example.auctionhouse.model.User;
import org.example.auctionhouse.repository.AuctionRepository;
import org.example.auctionhouse.repository.MessageRepository;
import org.example.auctionhouse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
public class AuctionService {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

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

    public List<Auction> searchAuctions(String search,Integer max,String category,String country,Boolean active, Integer id,Integer offset) {
        offset*=9;
        return auctionRepository.searchAuctions(search,max,category,country,active, id, offset);
    }

    public Integer searchAuctionsCount(String search,Integer max,String category,String country,Boolean active, Integer id) {
        return auctionRepository.searchAuctionsCount(search,max,category,country,active, id);
    }

    public List<Auction> findAllUserAuctions(Integer id ,Integer offset) {
        offset*=8;
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
        auction.setNumberOfBids(auction.getNumberOfBids()+1);

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
            User sender;
            String msg;

            User receiver = auction.getSeller().getUser();

            if(auction.getNumberOfBids() > 0){
                Bid winner = this.getHighestBidder(auction);
                sender = winner.getBidder().getUser();
                msg = "Hello, I just won the auction " + auction.getId() + " (" + auction.getName() + ").\n" +
                        "You can contact me to arrange payment and delivery.\n" +
                        "Phone Number: "+winner.getBidder().getUser().getPhone()+"\n" +
                        "Email: "+winner.getBidder().getUser().getEmail();
            }
            else{
                sender = userService.findById(Long.valueOf(1)).get();
                msg ="Sadly, there were no bids in your Auction: "+ auction.getId() + " || (" + auction.getName() + ").\n" +
                        "Don't be disheartened! This happens even to the most experienced Auctioneers.\n" +
                        "Try to auction again, at a different price, or for a longer period of time";
            }

            Message message = new Message(msg, sender, receiver);
            messageRepository.saveAndFlush(message);

            Set<Message> sent = sender.getSent();
            Set<Message> received = receiver.getReceived();

            //sent.add(message);
            //received.add(message);

            sender.setSent(sent);
            receiver.setReceived(received);

            receiver.setNotify(true);
            userService.saveOrUpdate(receiver);
            userService.saveOrUpdate(sender);

            this.saveOrUpdate(auction);
            return true;
        }
        return false;

    }

    public Double[][] getAllAuctionFeatures(List<Auction> auctions, Integer features){

        Double[][] allAuctionFeatures = new Double[auctions.size()][features];

        int i =0;
        for (Auction auction : auctions){
            Double[] auctionFeatures = auction.getAuctionFeatures();
            if(auctionFeatures == null){
                Random r = new Random();
                auctionFeatures = new Double[features];
                for (int j=0; j<features; j++){
                    auctionFeatures[j] = r.nextDouble();
                }
                auction.setAuctionFeatures(auctionFeatures);
                this.saveOrUpdate(auction);
            }
            allAuctionFeatures[i] = auctionFeatures;
            i++;
        }

        return allAuctionFeatures;
    }

    public Double[][] createRecommendationArray(List<Auction> auctions, List<User> users) {

        Double[][] recommendationArray = new Double[users.size()][auctions.size()];

        for (int i = 0; i<users.size(); i++){
            for (int j=0; j<auctions.size(); j++){
                recommendationArray[i][j] = 0.0;
            }
        }

        for (Auction auction : auctions){
            Set<Bid> bids = auction.getBids();
            int auctionId = Math.toIntExact(auction.getId() -1);
            for (Bid bid : bids){
                int bidderId = Math.toIntExact(bid.getBidder().getUser().getId() - 1);
                recommendationArray[bidderId][auctionId]++;
            }


        }
        return recommendationArray;
    }

    public List<Auction> getUserRecommendations(User user){
        List<Auction> allAuctions = findAllActiveAuctions(true);

        Double[] userFeatures = user.getUserFeatures();

        Double[][] allAuctionFeatures = getAllAuctionFeatures(allAuctions, userFeatures.length);

        Double[] predictionRow = new Double[allAuctions.size()];

        for (int i =0 ; i<allAuctionFeatures.length; i++){
            predictionRow[i]=0.0;
            for (int j=0; j<userFeatures.length;j++){
                predictionRow[i]+= userFeatures[j] * allAuctionFeatures[i][j];
            }
        }
        Double[] bestResults = new Double[5];
        Integer[] bestIndexes = new Integer[5];

        Double smallest= predictionRow[0];
        Integer smallest_index=0;

        for(int i=0; i<allAuctionFeatures.length; i++){
            if(i<5) {
                if(predictionRow[i]<smallest){
                    smallest=predictionRow[i];
                    smallest_index=i;
                }
                bestResults[i] = predictionRow[i];
                bestIndexes[i] = i;
            }
            else{
                if (predictionRow[i] > smallest){
                    bestResults[smallest_index] = predictionRow[i];
                    bestIndexes[smallest_index]=i;
                    smallest= predictionRow[i];
                    for(int j=0; j<5; j++){
                        if (bestResults[j] < smallest){
                            smallest= bestResults[j];
                            smallest_index = j;
                        }
                    }
                }
            }
        }

        System.out.print("BEST RESULTS OF USER '"+ user.getUsername() +"' ARE:\n\n");
        for (int i=0; i<5; i++){
            System.out.printf("%,.2f ", bestResults[i] );
        }

        List<Auction> recommendations = new ArrayList<>();
        for (int i=0; i<5; i++){
            recommendations.add(allAuctions.get(bestIndexes[i]));
        }
        System.out.print("\n\nAUCTION NAMES OF BEST RESULTS:\n\n");
        for(Auction auction : recommendations){
            System.out.print(auction.getName() + "\n");
        }
        return recommendations;
    }
}
