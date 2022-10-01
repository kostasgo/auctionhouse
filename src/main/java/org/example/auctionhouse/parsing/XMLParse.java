package org.example.auctionhouse.parsing;

import java.io.File;
import java.sql.Array;
import java.sql.Driver;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.example.auctionhouse.enums.RoleTypes;
import org.example.auctionhouse.model.*;
import org.example.auctionhouse.recommendations.MatrixFactorization;
import org.example.auctionhouse.repository.UserRepository;
import org.example.auctionhouse.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * This class is used to parse XML document using DOM parser.
 */

@Component
public class XMLParse {
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BidService bidService;

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BidderService bidderService;

    @Autowired
    private SellerService sellerService;

    @Autowired
    private RoleService roleService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Bean
    public Integer getFeaturesNumber(){
        return 10;
    }


    @EventListener(ApplicationReadyEvent.class)
    public void main(){

        try {
            if (roleService.findAll().isEmpty()) {
                roleService.saveOrUpdate(new Role(RoleTypes.ROLE_ADMIN));
                roleService.saveOrUpdate(new Role(RoleTypes.ROLE_USER));
            }
//            System.out.println("IN XML PARSE");
            //File Path
            String filePath = "./src/main/resources/static/ebay-data/items-0.xml";

            System.out.print("\nPARSING FILE : " + filePath +"\n");

            //Read XML file.
            File inputFile = new File(filePath);

            //Create DocumentBuilderFactory object.
            DocumentBuilderFactory dbFactory
                    = DocumentBuilderFactory.newInstance();

            //Get DocumentBuilder object.
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();

            //Parse XML file.
            Document document = dBuilder.parse(inputFile);
            document.getDocumentElement().normalize();

            //Print root element.
//            System.out.println("Root element:"
//                    + document.getDocumentElement().getNodeName());

            //Get element list.
            NodeList items =
                    document.getElementsByTagName("Item");
//            NodeList items = nodeList.item(0).getChildNodes();

            List<User> userlist = new ArrayList<>();



            for (int i = 1; i < 11; i++) {
                    User newuser = new User("user"+i, "name"+i, "user"+i+"@gmail.com", this.passwordEncoder.encode("user"+i), true);
                    Set<Role> roles = newuser.getRoles();
                    roles.add(roleService.findByName(RoleTypes.ROLE_USER).get());
                    newuser.setRoles(roles);
                    userService.saveOrUpdate(newuser);
                    Bidder newbidder = new Bidder(newuser);
                    Seller newseller = new Seller(newuser);
                    bidderService.saveOrUpdate(newbidder);
                    sellerService.saveOrUpdate(newseller);
                    newuser.setBidder(newbidder);
                    newuser.setSeller(newseller);
                    userService.saveOrUpdate(newuser);
                    userlist.add(newuser);
            }



            System.out.print("FOUND " + items.getLength() +" ITEMS INSIDE FILE.\nPARSING...\n");


            //Process element list.
//            items.getLength()
            for (int temp = 0; temp < 15; temp++) {
                Node item = items.item(temp);
                if (item.getNodeType() == Node.ELEMENT_NODE) {
                    Seller currentSeller = userlist.get(temp % 10).getSeller();


                    Element itemElement = (Element) item;
//                    System.out.print(itemElement.getElementsByTagName("Name").item(0).getTextContent());

                    String name = itemElement.getElementsByTagName("Name").item(0).getTextContent();
//                    System.out.print("name : "+ name);
//                    System.out.print("\n");

                    String description = itemElement.getElementsByTagName("Description").item(0).getTextContent();
//                    System.out.print("description : "+ description);
//                    System.out.print("\n");

                    List<Category> categories = new ArrayList<>();
                    NodeList categories_list = itemElement.getElementsByTagName("Category");
                    for (int temp2 = 0; temp2 < categories_list.getLength(); temp2++) {
                        Node category = categories_list.item(temp2);
                        if (category.getNodeType() == Node.ELEMENT_NODE) {
//                            System.out.print("category "+temp2+1+": "+category.getTextContent());
                            Category newCategory = categoryService.findByName(category.getTextContent());
                            if (newCategory == null ){
                                newCategory = new Category(category.getTextContent());
                                categoryService.saveOrUpdate(newCategory);
                            }
                            categories.add(newCategory);
                        }
                    }


                    System.out.print(" "+temp);
                    if(temp != items.getLength()) System.out.print(",");
                    if(temp % 45 == 44) System.out.print("\n");



                    Double currently = Double.parseDouble( itemElement.getElementsByTagName("Currently").item(0).getTextContent().replace("$","") ) ;
//                    System.out.print("currently : "+ currently);
//                    System.out.print("\n");

                    Double firstBid = Double.parseDouble( itemElement.getElementsByTagName("First_Bid").item(0).getTextContent().replace("$","") ) ;
//                    System.out.print("firstBid : "+ firstBid);
//                    System.out.print("\n");

                    Integer numberofbids = Integer.parseInt( itemElement.getElementsByTagName("Number_of_Bids").item(0).getTextContent() ) ;
//                    System.out.print("numberofbids : "+ numberofbids);
//                    System.out.print("\n");

                    String country = itemElement.getElementsByTagName("Country").item(0).getTextContent();
//                    System.out.print("country : "+ country);
//                    System.out.print("\n");

                    String location = itemElement.getElementsByTagName("Location").item(0).getTextContent();
//                    System.out.print("city(location) : "+ location);
//                    System.out.print("\n");



//                    String starts_string = itemElement.getElementsByTagName("Started").item(0).getTextContent();
//                    System.out.print("date_string : "+ date_string);
//                    System.out.print("\n");
                    LocalDateTime startDateTime = LocalDateTime.of(2021,
                            Month.JULY, 29, 19, 30, 40);


//                    String ends_string = itemElement.getElementsByTagName("Ends").item(0).getTextContent();
//                    System.out.print("ends_string : "+ ends_string);
//                    System.out.print("\n");

                    LocalDateTime endDateTime = LocalDateTime.of(2023,
                            Month.JULY, 29, 19, 30, 40);


                    Auction newAuction = new Auction(currentSeller, name, description, country, location, 41.901849, -75.10493, startDateTime, endDateTime, categories, 100000.00, firstBid, "");
                    Set<Bid> bids = new HashSet<>();
                    newAuction.setActive(true);
                    auctionService.saveOrUpdate(newAuction);
                    newAuction.setBids(bids);


                    NodeList bids_item = itemElement.getElementsByTagName("Bids");
                    NodeList bids_list = itemElement.getElementsByTagName("Bid");
//                    System.out.print(bids_list.getLength());

                    for (int temp2 = 0; temp2 < bids_list.getLength(); temp2++) {
                        Node bid = bids_list.item(temp2);
                        if (bid.getNodeType() == Node.ELEMENT_NODE) {
                            Element bidElement = (Element) bid;
//                            System.out.print(bid);
                            Double amount = Double.parseDouble(bidElement.getElementsByTagName("Amount").item(0).getTextContent().replace("$", ""));

                            Random rand = new Random();
                            int bidder_rand = rand.nextInt(1000) % 10;
                            while (bidder_rand == temp % 10) {
                                bidder_rand = rand.nextInt(1000) % 10;
                            }
                            Bidder newBidder = userlist.get(bidder_rand).getBidder();


                            Bid newbid = new Bid(newBidder, newAuction, LocalDateTime.now(), amount);
                            bidService.saveOrUpdate(newbid);


                            auctionService.addBidToAuction(newAuction, newbid);
                        }
                    }



//                    System.out.print("\n");
                }

            }
            System.out.print("\nDONE.\n");


            List<Auction> allAuctions = auctionService.findAll();
            List<User> allUsers = userRepository.findAll();
            System.out.print("BUILDING RECOMMENDATIONS ARRAY\n\n");
            Double[][] recommendationArray = auctionService.createRecommendationArray(allAuctions, allUsers);

            MatrixFactorization clf = new MatrixFactorization(auctionService, userService,getFeaturesNumber(), recommendationArray);

            User user = allUsers.get(allUsers.size()-1);



            clf.train(allAuctions, allUsers, 100000, 0.00001, 0.001, 1000, 0.001);

            List<Auction> recommendations = auctionService.getUserRecommendations(user);


        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}