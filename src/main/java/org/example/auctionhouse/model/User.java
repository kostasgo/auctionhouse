package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.util.HashSet;
import java.util.Set;

@Table(name = "user")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String name;

    @Email
    @Column(nullable = false)
    private String email;

    @Column
    private String phone;

    @Column
    private String country;

    @Column
    private String location;

    @JsonIgnore
    @Column(nullable = false)
    private String password;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();


    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"user"})
    @JoinColumn
    private Bidder bidder;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"user"})
    @JoinColumn
    private Seller seller;

    @Column
    private Boolean enabled = false;

    @Column
    private Boolean notify = false;

    @OneToMany(targetEntity = Message.class, mappedBy = "sender", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Message> sent = new HashSet<>();

    @OneToMany(targetEntity = Message.class, mappedBy = "receiver", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Message> received = new HashSet<>();

    public User(String username, String name, String email, String phone, String country, String location, String password) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.country = country;
        this.location = location;
        this.password = password;
    }
}
