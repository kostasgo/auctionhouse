package org.example.auctionhouse;

import org.example.auctionhouse.enums.RoleTypes;
import org.example.auctionhouse.model.*;
import org.example.auctionhouse.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SpringBootApplication
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
	private  CategoryService categoryService;



	public static void main(String[] args) {
		SpringApplication.run(AuctionhouseApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if (roleService.findAll().isEmpty()) {
			roleService.saveOrUpdate(new Role(RoleTypes.ADMIN.toString()));
			roleService.saveOrUpdate(new Role(RoleTypes.USER.toString()));
		}

		if (userService.findAll().isEmpty()) {

			User user1 = new User();
			user1.setUsername("admin");
			user1.setEmail("admin@example.org");
			user1.setName("Test Admin");
			user1.setPhone("9787456545");
			user1.setRole(roleService.findByName(RoleTypes.ADMIN.toString()));
			user1.setPassword(new BCryptPasswordEncoder().encode("admin"));
			userService.saveOrUpdate(user1);

			User user2= new User();
			user2.setUsername("user");
			user2.setEmail("user@example.org");
			user2.setName("Test user");
			user2.setPhone("1234516367");
			user2.setRole(roleService.findByName(RoleTypes.ADMIN.toString()));
			user2.setPassword(new BCryptPasswordEncoder().encode("user"));
			userService.saveOrUpdate(user2);

			if (auctionService.findAll().isEmpty()){

				Seller seller = new Seller(user2, 0);
				Bidder bidder = new Bidder(user2, 0);

				Category category = new Category("Instruments");

				List<Category> categories = new ArrayList<>();
				categories.add(category);

				categoryService.saveOrUpdate(category);

				sellerService.saveOrUpdate(seller);
				bidderService.saveOrUpdate(bidder);

				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

				LocalDateTime started = LocalDateTime.parse("15-09-2022 10:24:46", formatter);
				LocalDateTime ends = LocalDateTime.parse("23-09-2022 11:59:32", formatter);
				LocalDateTime bidTime = LocalDateTime.parse("16-09-2022 08:43:11", formatter);

				Auction auction = new Auction(seller, "Electric Guitar, slightly used", "I' selling this guitar, since I am buying a new one. It is in pretty good shape.", "Greece", "Athens", started, ends, categories, 600.00, 125.75);

				auctionService.saveOrUpdate(auction);

				Bid bid = new Bid(bidder, auction, bidTime, 140.00);
				bidService.saveOrUpdate(bid);

				Set<Bid> bids = new HashSet<Bid>();
				bids.add(bid);
				auction.setBids(bids);

				auctionService.saveOrUpdate(auction);
			}

		}

	}

}