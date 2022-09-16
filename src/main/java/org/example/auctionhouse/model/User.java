package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Table(name = "user")
@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column
    private String phone;

    @Column
    private String country;

    @Column
    private String location;

    @Column(nullable = false)
    private String password;
    @ManyToOne
    @JoinColumn(name = "role_id")
    @JsonBackReference
    private Role role;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn
    @JsonManagedReference
    private Bidder bidder;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn
    @JsonManagedReference
    private Seller seller;
}
