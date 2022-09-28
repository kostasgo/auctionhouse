package org.example.auctionhouse;

import org.example.auctionhouse.enums.RoleTypes;
import org.example.auctionhouse.model.*;
import org.example.auctionhouse.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SpringBootApplication
@EnableScheduling
public class AuctionhouseApplication implements CommandLineRunner {

	@Autowired
	private UserService userService;

	@Autowired
	private RoleService roleService;

	@Autowired
	private AuctionService auctionService;

	@Autowired
	private SellerService sellerService;

	@Autowired
	private BidderService bidderService;

	@Autowired
	private BidService bidService;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private MessageService messageService;


	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public static void main(String[] args) {
		SpringApplication.run(AuctionhouseApplication.class, args);
	}


	@Override
	public void run(String... args) throws Exception {
		if (roleService.findAll().isEmpty()) {
			roleService.saveOrUpdate(new Role(RoleTypes.ROLE_ADMIN));
			roleService.saveOrUpdate(new Role(RoleTypes.ROLE_USER));
		}

		if (userService.findAll().isEmpty()) {

			User user1 = new User();
			Set<Role> roles = user1.getRoles();
			roles.add(roleService.findByName(RoleTypes.ROLE_ADMIN).get());
			roles.add(roleService.findByName(RoleTypes.ROLE_USER).get());

			user1.setUsername("admin");
			user1.setEmail("admin@example.org");
			user1.setName("Test Admin");
			user1.setPhone("9787456545");
			user1.setRoles(roles);
			user1.setPassword(this.passwordEncoder.encode("admin"));
			user1.setEnabled(true);
			userService.saveOrUpdate(user1);

			User user2= new User();

			roles = user2.getRoles();
			roles.add(roleService.findByName(RoleTypes.ROLE_USER).get());

			user2.setUsername("user");
			user2.setEmail("user@example.org");
			user2.setName("Test user");
			user2.setPhone("1234516367");
			user2.setRoles(roles);
			user2.setPassword(this.passwordEncoder.encode("user"));
			user2.setEnabled(false);
			userService.saveOrUpdate(user2);


			User user3= new User();

			roles = user3.getRoles();
			roles.add(roleService.findByName(RoleTypes.ROLE_USER).get());
			user3.setUsername("tommyg");
			user3.setEmail("tomcat@website.org");
			user3.setName("Tom Gray");
			user3.setPhone("4653648767");
			user3.setRoles(roles);
			user3.setPassword(this.passwordEncoder.encode("tommyg"));
			user3.setEnabled(true);
			userService.saveOrUpdate(user3);

			if (auctionService.findAll().isEmpty()){

				Seller seller = new Seller(user2);
				Bidder bidder = new Bidder(user2);
				user2.setSeller(seller);
				user2.setBidder(bidder);

				Seller seller2 = new Seller(user3);
				Bidder bidder2 = new Bidder(user3);

				user3.setSeller(seller2);
				user3.setBidder(bidder2);

				sellerService.saveOrUpdate(seller);
				bidderService.saveOrUpdate(bidder);

				sellerService.saveOrUpdate(seller2);
				bidderService.saveOrUpdate(bidder2);

				userService.saveOrUpdate(user2);
				userService.saveOrUpdate(user3);


				Category category = new Category("Instruments");
				Category category2_1 = new Category("Cars");
				Category category2_2 = new Category("Vehicles");
				Category category3 = new Category("Jewlery");
				Category category4 = new Category("Shoes");

				categoryService.saveOrUpdate(category);
				categoryService.saveOrUpdate(category2_1);
				categoryService.saveOrUpdate(category2_2);
				categoryService.saveOrUpdate(category3);
				categoryService.saveOrUpdate(category4);

				List<Category> categories = new ArrayList<>();
				categories.add(category);

				List<Category> categories2 = new ArrayList<>();
				categories2.add(category2_1);
				categories2.add(category2_2);

				List<Category> categories3 = new ArrayList<>();
				categories3.add(category3);

				List<Category> categories4 = new ArrayList<>();
				categories4.add(category4);

				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

				LocalDateTime started = LocalDateTime.parse("15-09-2022 10:24:46", formatter);
				LocalDateTime ends = LocalDateTime.parse("25-09-2022 23:59:59", formatter);

				LocalDateTime started2 = LocalDateTime.parse("17-09-2022 12:20:10", formatter);
				LocalDateTime ends2 = LocalDateTime.parse("29-09-2022 11:59:59", formatter);

				LocalDateTime started3 = LocalDateTime.parse("25-09-2022 10:24:46", formatter);
				LocalDateTime ends3 = LocalDateTime.parse("27-09-2022 17:00:00", formatter);

				LocalDateTime started4 = LocalDateTime.parse("22-09-2022 10:24:46", formatter);
				LocalDateTime ends4 = LocalDateTime.parse("02-10-2022 17:00:00", formatter);

				LocalDateTime started5 = LocalDateTime.parse("20-09-2022 10:00:00", formatter);
				LocalDateTime ends5 = LocalDateTime.parse("07-10-2022 19:00:00", formatter);


				String images = "https://i.ebayimg.com/images/g/R1QAAOSwgGRjHJy5/s-l1600.jpg,https://i.ebayimg.com/images/g/n68AAOSwEkVhU~uU/s-l500.jpg";

				String images2 = "https://i.ebayimg.com/images/g/SmEAAOSwyU9iSNw1/s-l1600.jpg";

				String images3 = "https://i.ebayimg.com/images/g/eYoAAOSwBSljLDQm/s-l500.jpg";

				String images4 = "https://cdn.flightclub.com/TEMPLATE/172524/1.jpg";

				String images5 = "https://5.imimg.com/data5/SELLER/Default/2021/7/BD/CB/AC/12194828/marquise-diamond-earrings-500x500.jpeg";



				Auction auction1 = new Auction(seller, "Electric Guitar, slightly used", "I'm selling this guitar, since I am buying a new one. It is in pretty good shape.", "Greece", "Athens", 37.983810, 23.727539 , started, ends, categories, 300.00, 125.75, images);
				Auction auction2 = new Auction(seller2, "1965 Ford Mustang GT350 Mustang", "TRYING TO GET RID OF THIS CAR. HAS DECENT MILEAGE BUT STILL WORKS LIKE A BEAUTY. TREAT IT WITH RESPECT", "Greece", "Thessaloniki",40.629269,22.947412, started2, ends2, categories2, 15000.00, 2000.00, images2);
				Auction auction3 = new Auction(seller, "Gold bracelet", "Many many carats. Belonged to my late granny.", "Greece", "Athens",37.983810,23.727539, started3, ends3, categories3, 500.00, 100.00, images3);
				Auction auction4 = new Auction(seller, "Nike Jordans", "Never worn. Number 44 (EU)", "Greece", "Athens",37.983810,23.727539, started4, ends4, categories4, 200.00, 80.00, images4);
				Auction auction5 = new Auction(seller2, "Diamond earrings", "12 Carats, originally bought 2.000 euros", "Greece", "Athens",37.983810,23.727539, started5, ends5, categories3, 2000.00, 500.00, images5);


				auction1.setActive(true);
				auction2.setActive(true);
				auction3.setActive(true);
				auction4.setActive(true);
				auction5.setActive(true);

				auctionService.saveOrUpdate(auction1);
				auctionService.saveOrUpdate(auction2);
				auctionService.saveOrUpdate(auction3);
				auctionService.saveOrUpdate(auction4);
				auctionService.saveOrUpdate(auction5);


				LocalDateTime bidTime = LocalDateTime.parse("16-09-2022 08:43:11", formatter);
				Bid bid = new Bid(bidder, auction1, bidTime, 140.00);
				bidService.saveOrUpdate(bid);

				Set<Bid> bidder_bids = bidder.getBids();
				bidder_bids.add(bid);
				bidder.setBids(bidder_bids);
				bidderService.saveOrUpdate(bidder);

				LocalDateTime bidTime2 = LocalDateTime.parse("21-09-2022 10:13:05", formatter);
				Bid bid2 = new Bid(bidder2, auction3, bidTime, 500.00);
				bidService.saveOrUpdate(bid2);

				Set<Bid> bidder2_bids = bidder2.getBids();
				bidder_bids.add(bid);
				bidder2.setBids(bidder2_bids);
				bidderService.saveOrUpdate(bidder2);


				Set<Bid> bids = new HashSet<Bid>();
				bids.add(bid);
				auction1.setBids(bids);
				auction1.setCurrently(140.00);

				Set<Bid> bids2 = new HashSet<Bid>();
				bids2.add(bid2);
				auction2.setBids(bids2);
				auction2.setCurrently(2300.00);

				auctionService.saveOrUpdate(auction1);
				auctionService.saveOrUpdate(auction2);

				Set<Auction> seller_auctions = seller.getAuctions();
				seller_auctions.add(auction1);
				seller_auctions.add(auction3);
				seller_auctions.add(auction4);
				seller.setAuctions(seller_auctions);
				sellerService.saveOrUpdate(seller);

				Set<Auction> seller2_auctions = seller2.getAuctions();
				seller2_auctions.add(auction2);
				seller2_auctions.add(auction5);
				seller.setAuctions(seller2_auctions);
				sellerService.saveOrUpdate(seller2);


				Message message1 = new Message("hallo! i won an auction and would love some more info on the prize", Long.valueOf(3),Long.valueOf(2));
				Message message2 = new Message("hallo! sure lets talk more", Long.valueOf(2),Long.valueOf(3));
				Message message3 = new Message("ok, where shall we meet to make the trade?", Long.valueOf(3),Long.valueOf(2));
				Message message4 = new Message("not sure... maybe if you want we can make the payment online and ill send you the thing.", Long.valueOf(2),Long.valueOf(3));
				Message message5 = new Message("Or we can meet in athens from wednesday on.", Long.valueOf(2),Long.valueOf(3));

				messageService.saveOrUpdate(message1);
				messageService.saveOrUpdate(message2);
				messageService.saveOrUpdate(message3);
				messageService.saveOrUpdate(message4);
				messageService.saveOrUpdate(message5);

			}

		}

	}

}