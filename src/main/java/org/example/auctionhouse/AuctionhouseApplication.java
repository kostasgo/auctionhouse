package org.example.auctionhouse;

import org.example.auctionhouse.enums.RoleTypes;
import org.example.auctionhouse.model.*;
import org.example.auctionhouse.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
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
			user2.setEnabled(true);
			userService.saveOrUpdate(user2);

			if (auctionService.findAll().isEmpty()){

				Seller seller = new Seller(user2);
				Bidder bidder = new Bidder(user2);

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

				Auction auction1 = new Auction(seller, "Electric Guitar, slightly used", "I' selling this guitar, since I am buying a new one. It is in pretty good shape.", "Greece", "Athens", started, ends, categories, 600.00, 125.75, "https://i.ebayimg.com/images/g/R1QAAOSwgGRjHJy5/s-l1600.jpg");
				Auction auction2 = new Auction(seller, "Electric Guitar2, slightly used", "I' selling this guitar, since I am buying a new one. It is in pretty good shape.", "Greece", "Athens", started, ends, categories, 600.00, 125.75, "https://i.ebayimg.com/images/g/R1QAAOSwgGRjHJy5/s-l1600.jpg");
				Auction auction3 = new Auction(seller, "Electric Guitar3, slightly used", "I' selling this guitar, since I am buying a new one. It is in pretty good shape.", "Greece", "Athens", started, ends, categories, 600.00, 125.75, "https://i.ebayimg.com/images/g/R1QAAOSwgGRjHJy5/s-l1600.jpg");

				auctionService.saveOrUpdate(auction1);
				auctionService.saveOrUpdate(auction2);
				auctionService.saveOrUpdate(auction3);



				Bid bid = new Bid(bidder, auction1, bidTime, 140.00);
				bidService.saveOrUpdate(bid);

				Set<Bid> bids = new HashSet<Bid>();
				bids.add(bid);
				auction1.setBids(bids);

				auctionService.saveOrUpdate(auction1);
			}

		}

	}

}