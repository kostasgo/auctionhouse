package org.example.auctionhouse;

import org.example.auctionhouse.enums.RoleTypes;
import org.example.auctionhouse.model.Role;
import org.example.auctionhouse.model.User;
import org.example.auctionhouse.service.RoleService;
import org.example.auctionhouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class AuctionhouseApplication implements CommandLineRunner {

	@Autowired
	private UserService userService;

	@Autowired
	private RoleService roleService;

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

			User user = new User();
			user.setUsername("admin");
			user.setEmail("admin@example.org");
			user.setName("Test Admin");
			user.setPhone("9787456545");
			user.setRole(roleService.findByName(RoleTypes.ADMIN.toString()));
			user.setPassword(new BCryptPasswordEncoder().encode("admin"));
			userService.saveOrUpdate(user);
		}

	}

}