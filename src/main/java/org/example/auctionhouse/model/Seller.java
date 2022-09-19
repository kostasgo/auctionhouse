package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "seller")
public class Seller {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"seller", "email", "name","phone","country","role","bidder","location"})
    private User user;

    @Column
    private Integer rating;


    @OneToMany(targetEntity = Auction.class, mappedBy = "seller", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Auction> auctions;

    public Seller(User user, Integer rating) {
        this.user = user;
        this.rating = rating;
    }
}
