//package org.example.auctionhouse.service;
//
//import java.util.ArrayList;
//import java.util.Collection;
//
//import org.example.auctionhouse.model.User;
//import org.example.auctionhouse.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//
//
//@Service("userDetailsService")
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = userRepository.findByUsername(username);
//        if (user == null) {
//            throw new UsernameNotFoundException("User " + username + " not found");
//        }
//        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
//                getGrantedAuthority(user));
//    }
//
//    private Collection<GrantedAuthority> getGrantedAuthority(User user) {
//        Collection<GrantedAuthority> authorities = new ArrayList<>();
//        if (user.getRole().getName().equalsIgnoreCase("admin")) {
//            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
//        }
//        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
//        return authorities;
//    }
//
//}
