package org.example.auctionhouse.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "seller")
public class Seller {

    @Id @Column(name="user_id") Long id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private Integer rating;

    @OneToMany(targetEntity = Auction.class, mappedBy = "seller", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Auction> auctions;


}
