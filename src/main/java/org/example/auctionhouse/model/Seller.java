package org.example.auctionhouse.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonIgnoreProperties({"seller", "email", "name","phone","country","role","bidder","location"})
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private Integer rating;

    @Column(name= "rating_count")
    private Double ratingCount;

    @OneToMany(targetEntity = Auction.class, mappedBy = "seller", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Auction> auctions;

    public Seller(User user) {
        this.user = user;
        this.rating = 0;
        this.ratingCount = 0.0;
    }
}
